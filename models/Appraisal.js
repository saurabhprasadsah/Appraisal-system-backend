// models/Appraisal.js
const mongoose = require('mongoose');

const AppraisalSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  // Add other fields as needed
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appraisal', AppraisalSchema);