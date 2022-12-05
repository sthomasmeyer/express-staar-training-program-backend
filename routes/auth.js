'use strict';

const express = require('express');

const jsonschema = require('jsonschema');
const userAuthSchema = require('../schemas/userAuth.json');
const userRegisterSchema = require('../schemas/userNewAnon.json');

// Import the 'User' class (+) the [createToken()] function.
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');

const { BadRequestError } = require('../expressError');

const router = new express.Router();

// Users login by sending an HTTP POST request to '.../auth/token' -->
// The asynchronous function built into this route verifies that the provided...
// username (+) password are valid, then generates a JWT for the user.
router.post('/token', async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { email, pwd } = req.body;
    const user = await User.authenticate(email, pwd);
    const token = createToken(user);
    return res.json({ user, token });
  } catch (err) {
    return next(err);
  }
});

// The asynchronous function built into this route: (1) captures key info...
// about the new user from the request body (username, password, etc.)...
// (2) uses that info to create a new instance of the 'User' class...
// (3) executes the [register()] method, which not only hashes the...
// password but also completes the user-registration process.
router.post('/register', async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    // Note, it is not possible to create admin-accounts w/ this POST request.
    const newUser = await User.register({ ...req.body, adminAccount: false });

    // Generate a JWT for the new user.
    const token = createToken(newUser);

    return res.status(201).json({ newUser, token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
