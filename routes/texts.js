'use strict';

const express = require('express');
const { authenticateJWT, ensureAdmin } = require('../middleware/auth');

// Import the 'Text' class.
const Text = require('../models/text');

const router = express.Router();

/* DYNAMIC ROUTES */

// GET a text by its 'module_id' field --> return basic info: {texts: [{id, title, author}, ...]}
router.get('/:subject/:moduleId', authenticateJWT, async (req, res, next) => {
  try {
    const text = await Text.getTextBySubjectAndModuleId(
      req.params.subject,
      req.params.moduleId
    );
    return res.json({ text });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
