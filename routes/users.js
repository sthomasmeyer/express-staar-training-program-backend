'use strict';

const express = require('express');

const jsonschema = require('jsonschema');
const userRegisterSchema = require('../schemas/userNewAdmin.json');

// Import the 'User' class (+) the [createToken()] function.
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');

const {
  authenticateJWT,
  ensureCorrectUserOrAdmin,
  ensureAdmin
} = require('../middleware/auth');
const { BadRequestError } = require('../expressError');

// Create a new instance of the 'Router' class.
const router = express.Router();

/* STATIC ROUTES */

// The asynchronous function built into this route is remarkably similar to...
// the one found in the 'auth/register' route. The key difference is that it...
// is possible to create admin-accounts with this POST request, which is why...
// the [ensureAdmin] middleware function is in place.
router.post('/', authenticateJWT, ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register(req.body);

    // Generate a JWT for the new user.
    const token = createToken(newUser);

    // Return the JSON object literal {token: jwt-token-string}.
    return res.status(201).json({ newUser, token });
  } catch (err) {
    return next(err);
  }
});

// GET a list of users --> return basic info: {users: [{id, email address, school_id}, ...]}
// Note, only administrators should be able to make this request.
router.get('/', authenticateJWT, ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/* DYNAMIC ROUTES */

// GET a specific user, by their email address --> return data related to that user.
router.get(
  '/:id',
  authenticateJWT,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const user = await User.getById(req.params.id);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

// (admin-only) --> DELETE a single user, by their email address.
router.delete(
  '/:email',
  authenticateJWT,
  ensureAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.email);
      return res.json({ deleted: req.params.email });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
