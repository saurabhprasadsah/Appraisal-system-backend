const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.post('/', auth, createQuestion);
router.get('/', auth, getAllQuestions);
router.get('/:id', auth, getQuestionById);
router.put('/:id', auth, updateQuestion);
router.delete('/:id', auth, deleteQuestion);

module.exports = router;