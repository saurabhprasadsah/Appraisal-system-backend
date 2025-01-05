const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  type: {
    type: String,
    enum: ['rating', 'text', 'multiple-choice'],
    required: [true, 'Question type is required']
  },
  options: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);