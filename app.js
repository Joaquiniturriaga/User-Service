require('dotenv').config();

const express = require('express');
const { router } = require('./src/routes/user.routes');
const { validateInternalSecret } = require('./src/middlewares/internalSecret.middleware');

const app = express();

app.use(express.json());

app.use(
  '/api/users',
  validateInternalSecret,
  router
);

app.get('/', (req, res) => {
  res.send('User service running');
});

module.exports = app;