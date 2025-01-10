
const mongoose = require('mongoose');

const AppraisalSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['self', 'supervisor', 'peer', 'junior'],
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      response: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'submitted', 'reviewed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Appraisal = mongoose.model('Appraisal', AppraisalSchema);