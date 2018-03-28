const express = require('express');
const _ = require('lodash');
const { body, validationResult } = require('express-validator/check');
const router = express.Router();

const users = [
  {id: 1, firstName: 'Marek', secondName: 'Chmiel', age: '28'},
  {id: 2, firstName: 'Jerzy', secondName: 'Kwiatkowski', age: '25'}
];

const response = (res, status, json) => {
  res.header('content-type', 'application/json');
  res.status(status);
  res.json(json);
};

const firstNameReg = /^[a-zA-Z]{3,}$/;
const secondNameReg = /^[a-zA-Z]{1,}$/;
const ageReg = /\d{2}/;

const validationParams = [
  body('firstName', 'Empty name. Only alphabetic letters.').matches(firstNameReg),
  body('secondName', 'Empty surname. Only alphabetic letters.').matches(secondNameReg),
  body('age', 'Age must contain 2 digits max.').matches(ageReg)
];

//GET requests
router.get('/', (req, res) => {
  const { id, firstName, secondName, age } = req.query;
  const queryOptions = {
    id,
    firstName,
    secondName,
    age
  };
  const filteredUsers = _.filter(
    users, 
    _.pickBy(queryOptions, v => v) //since there is need to get only truthy properties from queryOptions object
  );
  response(res, 200, { users: filteredUsers });
});

router.get('/:id([0-9]{1,})', (req, res) => {
  const { id } = req.params;
  const selectedUser = _.find(users, (user) => user.id == id);
  if(selectedUser) {
    response(res, 200, selectedUser);
  } else {
    response(res, 404, { message: 'User was not found.' });
  }
});

//POST request
router.post('/', validationParams, (req, res) => {
  const { firstName, secondName, age } = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    response(res, 400, { errors: errors.mapped() });
  } else {
    const newId = users[users.length-1].id+1;
    users.push({
      id: newId,
      firstName,
      secondName,
      age
    });
    res.location(`http://localhost:3000/api/users/${newId}`);
    response(res, 201, { message: 'New user created.', location: `/api/users/${newId}` });
  }
});

//PUT request
router.put('/:id', validationParams, (req, res) => {
  const { firstName, secondName, age } = req.body;
  const { id } = req.params;
  if(!errors.isEmpty()) {
    response(res, 400, { errors: errors.mapped() });
  } else {
    const selectedId = _.findIndex(users, (user) => user.id == id);
    const userObj = {
      id: parseInt(id),
      firstName,
      secondName,
      age
    };
    if(selectedId === -1) {
      users.push(userObj);
      res.location(`http://localhost:3000/api/users/${id}`);
      response(res, 201, { message: 'New user created.', location: `/api/users/${id}` });
    } else {
      users[selectedId] = userObj;
      response(res, 200, { message: `User id ${id} updated.` });
    }
  }
});

//DELETE request
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const selectedId = _.findIndex(users, (user) => user.id == id);
  if(selectedId === -1) {
    res.status(404);
    res.send(null);
  } else {
    users.splice(selectedId, 1);
    res.status(204);
    res.send(null);
  }
});

module.exports = router;