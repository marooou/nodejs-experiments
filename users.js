const express = require('express');
const _ = require('lodash');
const router = express.Router();

const users = [
  {id: 1, firstName: 'Marek', secondName: 'Chmiel', age: '28'},
  {id: 2, firstName: 'Jerzy', secondName: 'Kwiatkowski', age: '25'}
];

const response = (res, obj) => {
  res.header(obj.header);
  res.status(obj.status);
  res.json(obj.json);
};

const firstNameReg = /^[a-zA-Z]{3,}$/g;
const secondNameReg = /^[a-zA-Z]{1,}$/g;
const ageReg = /^[0-9]{1-2}$/g;

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
  response(res, {
    header: "'content-type', 'application/json'",
    status: 200,
    json: { users: filteredUsers }
  });
});

router.get('/:id([0-9]{1,})', (req, res) => {
  const { id } = req.params;
  const selectedUser = _.find(users, (user) => user.id == id);
  if(selectedUser) {
    response(res, {
      header: "'content-type', 'application/json'",
      status: 200,
      json: selectedUser,
    });
  } else {
    response(res, {
      header: "'content-type', 'application/json'",
      status: 404,
      json: { message: 'User was not found.' },
    });
  }
});

//POST request
router.post('/', (req, res) => {
  const { firstName, secondName, age } = req.body;
  if(
    !firstName.toString().match(firstNameReg) ||
    !secondName.toString().match(secondNameReg) ||
    !age.toString().match(ageReg)
  ) {
    response(res, {
      header: "'content-type', 'application/json'",
      status: 400,
      json: { message: 'Please provide all required fields: firstName, secondName, age' },
    });
  } else {
    const newId = users[users.length-1].id+1;
    users.push({
      id: newId,
      firstName,
      secondName,
      age
    });
    res.location('http://localhost:3000/api/users/' + newId);
    response(res, {
      header: "'content-type', 'application/json'",
      status: 201,
      json: { message: 'New user created.', location: '/api/users/' + newId },
    });
  }
});

//PUT request
router.put('/:id', (req, res) => {
  const { firstName, secondName, age } = req.body;
  const { id } = req.params;
  if(
    !firstName.toString().match(firstNameReg) ||
    !secondName.toString().match(secondNameReg) ||
    !age.toString().match(age)
  ) {
    response(res, {
      header: "'content-type', 'application/json'",
      status: 400,
      json: { message: 'Please provide all required fields. Pattern: firstName: John, secondName: Smith, age: 32' }
    });
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
      res.location('http://localhost:3000/api/users/' + id);
      response(res, {
        header: "'content-type', 'application/json'",
        status: 201,
        json: { message: 'New user created.', location: '/api/users/' + id },
      });
    } else {
      users[selectedId] = userObj;
      response(res, {
        header: "'content-type', 'application/json'",
        status: 200,
        json: { message: 'User id ' + id + ' updated.'},
      });
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