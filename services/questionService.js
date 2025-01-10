const { Question } = require('../models/Question');

const createQuestion = async (data) => {
  return await Question.create(data);
};

const getActiveQuestions = async () => {
  return await Question.find({ isActive: true });
};

module.exports = {
  createQuestion,
  getActiveQuestions,
};
