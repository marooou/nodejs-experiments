const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

const users = require('./users.js');

app.use('/api/users', users);

app.get('/weed', (req, res) => {
  res.status(451);
  res.send(null);
});

app.get('/teapot', (req, res) => {
  res.status(418);
  res.send(null);
});

const port = 3000;

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));