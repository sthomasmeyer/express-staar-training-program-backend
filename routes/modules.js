'use strict';

const express = require('express');

const jsonschema = require('jsonschema');
const firstAttemptPerformanceSchema = require('../schemas/firstAttemptPerformanceUpdate.json');
const modulePerformanceUpdateSchema = require('../schemas/modulePerformanceUpdate.json');

const Module = require('../models/module');

const { BadRequestError } = require('../expressError');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/* DYNAMIC ROUTES */

router.get('/:subject', async (req, res, next) => {
  try {
    const modules = await Module.findAllBySubject(req.params.subject);
    return res.json({ modules });
  } catch (err) {
    return next(err);
  }
});

router.get('/:subject/:id', async (req, res, next) => {
  try {
    const targetModule = await Module.findBySubjectPlusId(
      req.params.subject,
      req.params.id
    );
    return res.json({ targetModule });
  } catch (err) {
    return next(err);
  }
});

router.post('/:subject/first_attempt', async (req, res, next) => {
  try {
    const validator = jsonschema.validate(
      req.body,
      firstAttemptPerformanceSchema
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const firstAttemptSubmission = await Module.firstAttemptPerformance(
      req.params.subject,
      req.body
    );

    return res.status(201).json({ firstAttemptSubmission });
  } catch (err) {
    next(err);
  }
});

// GET all module performance data by user_id
router.get(
  '/:subject/module_performance/user/:userId',
  async (req, res, next) => {
    try {
      const allPerformanceData = await Module.getAllPerformanceData(
        req.params.subject,
        req.params.userId
      );
      return res.json({ allPerformanceData });
    } catch (err) {
      next(err);
    }
  }
);

// GET specific module performance data by module_id (+) user_id
router.get('/:subject/:moduleId/:userId', async (req, res, next) => {
  try {
    const userPerformanceData = await Module.getPerformanceData(
      req.params.subject,
      req.params.moduleId,
      req.params.userId
    );
    return res.json({ userPerformanceData });
  } catch (err) {
    next(err);
  }
});

router.patch('/:subject/update', async (req, res, next) => {
  try {
    const validator = jsonschema.validate(
      req.body,
      modulePerformanceUpdateSchema
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const performanceUpdate = await Module.performanceUpdate(
      req.params.subject,
      req.body
    );

    return res.status(201).json({ performanceUpdate });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
