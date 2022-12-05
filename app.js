'use strict';

const express = require('express');
const app = express();

// [express.json()] is a built-in middleware function that parses incoming...
// requests with JSON payloads.
app.use(express.json());

// Import cors from the [node_modules] directory --> it is designed to provide an...
// Express middleware that can be used to enable Cross-Origin Resource Sharing (CORS).
const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('tiny'));

// Import the routes: 'auth(orization)', 'users'...
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const textRoutes = require('./routes/texts');
const questionRoutes = require('./routes/questions');
const moduleRoutes = require('./routes/modules');
const responseRoutes = require('./routes/responses');
const schoolRoutes = require('./routes/schools');

// In Express.js the [app.use(path, callback)] function is used to mount the...
// specified middleware function(s) at the specified path.
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/texts', textRoutes);
app.use('/questions', questionRoutes);
app.use('/modules', moduleRoutes);
app.use('/responses', responseRoutes);
app.use('/schools', schoolRoutes);

const { NotFoundError } = require('./expressError');

// [404] error handler:
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// General error handler:
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = app;
