const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Create a new question (Admin only)
router.post('/', auth, authorize(['admin']), questionController.createQuestion);

// Get all active questions
router.get('/', auth, questionController.getQuestions);

module.exports = router;
