const express = require('express');
const router = express.Router();

const users = [
  {id: 1, firstName: 'Marek', secondName: 'Chmiel', age: 28},
  {id: 2, firstName: 'Jerzy', secondName: 'Kwiatkowski', age: 25}
];

//GET requests
router.get('/', (req, res) => {
  res.header('content-type', 'application/json');
  res.status(200);
  res.json(users);
});

router.get('/:id([0-9]{1,})', (req, res) => {
  const currUser = users.filter((user) => {
    if(user.id == req.params.id) {
      return true;
    }
  });
  if(currUser.length == 1) {
    res.header('content-type', 'application/json');
    res.status(200);
    res.json(currUser[0]);
  } else {
    res.header('content-type', 'application/json');
    res.status(404);
    res.json({ message: 'Not Found' });
  }
});

router.get('/search', (req, res) => {
  const currUser = users.filter((user) => {
    const queryName = Object.keys(req.query)[0];
    const queryValue = req.query[queryName];
    if(user[queryName] == queryValue) {
      return true;
    }
  });
  if(currUser.length == 1) {
    res.header('content-type', 'application/json');
    res.status(200);
    res.json(currUser[0]);
  } else {
    res.header('content-type', 'application/json');
    res.status(404);
    res.json({ message: 'Not Found' });
  }
});

//POST request
router.post('/', (req, res) => {
  const { firstName, secondName, age } = req.body;
  if(
    !firstName ||
    !secondName ||
    !age.toString().match(/^[0-9]{2}$/g)
  ) {
    res.header('content-type', 'application/json');
    res.status(400);
    res.json({ message: 'Bad Request' });
  } else {
    const newId = users[users.length-1].id+1;
    users.push({
      id: newId,
      firstName: firstName,
      secondName: secondName,
      age: parseInt(age)
    });
    res.location('http://localhost:3000/api/users/' + newId);
    res.header('content-type', 'application/json');
    res.status(201);
    res.json({ message: 'New user created.', location: '/api/users/' + newId });
  }
});

//PUT request
router.put('/:id', (req, res) => {
  const { firstName, secondName, age } = req.body;
  const { id } = req.params;
  if(
    !firstName ||
    !secondName ||
    !age.toString().match(/^[0-9]{2}$/g) ||
    !id.toString().match(/^[0-9]{1,}$/g)
  ) {
    res.header('content-type', 'application/json');
    res.status(400);
    res.json({ message: 'Bad Request' });
  } else {
    const updateId = users.map((user) => user.id).indexOf(parseInt(id));
    if(updateId === -1) {
      users.push({
        id: parseInt(id),
        firstName: firstName,
        secondName: secondName,
        age: parseInt(age)
      });
      res.header('content-type', 'application/json');
      res.location('http://localhost:3000/api/users/' + id);
      res.status(201);
      res.json({ message: 'New user created.', location: '/api/users/' + id });
    } else {
      users[updateId] = {
        id: parseInt(id),
        firstName: firstName,
        secondName: secondName,
        age: parseInt(age)
      };
      res.header('content-type', 'application/json');
      res.status(200);
      res.json({ message: 'User id ' + id + ' updated.', location: '/api/users/' + id });
    }
  }
});

//DELETE request
router.delete('/:id', (req, res) => {
  const removeIndex = users.map((user) => user.id).indexOf(parseInt(req.params.id));
  if(removeIndex === -1) {
    res.status(404);
    res.send(null);
  } else {
    users.splice(removeIndex, 1);
    res.status(204);
    res.send(null);
  }
});

module.exports = router;