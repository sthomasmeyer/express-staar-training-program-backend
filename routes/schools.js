'use strict';

const express = require('express');

// Import the 'School' class.
const School = require('../models/school');

const router = express.Router();

/* STATIC ROUTES */

// GET a list of schools --> return basic info: {schools: [{id, city, county}, ...]}
router.get('/', async (req, res, next) => {
  try {
    const schools = await School.findAll();
    return res.json({ schools });
  } catch (err) {
    return next(err);
  }
});

/* DYNAMIC ROUTES */

router.get('/:id', async (req, res, next) => {
  try {
    const school = await School.getById(req.params.id);
    return res.json({ school });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
