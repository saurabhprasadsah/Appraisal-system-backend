const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  type: {
    type: String,
    enum: ['rating', 'text', 'multiple-choice'],
    required: [true, 'Question type is required'],
  },
  options: {
    type: [String],
    validate: {
      validator: function(value) {
        return this.type === 'multiple-choice' ? value.length > 0 : true;
      },
      message: 'Options are required for multiple-choice questions.',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Question = mongoose.model('Question', QuestionSchema);