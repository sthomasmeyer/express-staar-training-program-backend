'use strict';

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

// This function authenticates the JWT provided by the user. If the verification...
// process is successful, then it stores the token payload in [res.locals].
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, '').trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// Raise an 'Unauthorized' error if the active user has not logged in successfully.
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// Is the active user an administrator?
function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user.adminAccount) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// This function is designed to ensure that the active user is either an administrator...
// or that their [id] matches the [id] in the given parameters.
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;

    if (!(user && (user.adminAccount || user.id === +req.params.id))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin
};
