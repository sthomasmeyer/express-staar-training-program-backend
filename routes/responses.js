'use strict';

const express = require('express');

const jsonschema = require('jsonschema');
const responseSubmissionSchema = require('../schemas/responseSubmission.json');

const Response = require('../models/response');

const { BadRequestError } = require('../expressError');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/* DYNAMIC ROUTES */

router.post('/:subject', authenticateJWT, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, responseSubmissionSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    Response.clearOutdated(
      req.params.subject,
      req.body.questionId,
      req.body.userId
    );

    const newResponse = await Response.submit(req.params.subject, req.body);

    return res.status(201).json({ newResponse });
  } catch (err) {
    next(err);
  }
});

router.get('/:subject/:userId/:moduleId', async (req, res, next) => {
  try {
    const responses = await Response.findBySubjectUserAndModule(
      req.params.subject,
      req.params.userId,
      req.params.moduleId
    );

    return res.json({ responses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
