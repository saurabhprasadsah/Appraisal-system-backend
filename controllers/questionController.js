const Question = require('../models/Question');
const { AppError } = require('../utils/errorHandler');

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      throw new AppError('Question not found', 404);
    }
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!question) {
      throw new AppError('Question not found', 404);
    }
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      throw new AppError('Question not found', 404);
    }
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};