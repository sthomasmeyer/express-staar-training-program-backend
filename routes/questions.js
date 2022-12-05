'use strict';

const express = require('express');
const { authenticateJWT } = require('../middleware/auth');

// Import the 'Question' class.
const Question = require('../models/question');

const router = express.Router();

/* STATIC ROUTES */

// GET a list of questions --> return basic info: {questions: [{id, alignedStandards, questionType}, ...]}
router.get('/', async function (req, res, next) {
  try {
    const questions = await Question.findAll();
    return res.json({ questions });
  } catch (err) {
    return next(err);
  }
});

/* DYNAMIC ROUTES */

// Get questions by 'module_id' --> return basic info: {questions: [{id, alignedStandards, questionType}, ...]}
// Note, this is a protected route. Only users w/ valid JWTs have access.
router.get('/:moduleId', authenticateJWT, async (req, res, next) => {
  try {
    const questions = await Question.getQuestionsByModule(req.params.moduleId);
    return res.json({ questions });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
