const { createQuestion, getActiveQuestions } = require('../services/questionService');

const questionController = {
  createQuestion: async (req, res, next) => {
    try {
      const question = await createQuestion(req.body);
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  },

  getQuestions: async (req, res, next) => {
    try {
      const questions = await getActiveQuestions();
      res.json(questions);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = questionController;
