const { Appraisal } = require('../models/Appraisal');

const createAppraisal = async (data) => {
  return await Appraisal.create(data);
};

const getAppraisalsByParticipant = async (participantId) => {
  return await Appraisal.find({ participant: participantId })
    .populate('reviewer')
    .populate('answers.questionId');
};

const getAppraisalsByReviewer = async (reviewerId) => {
  return await Appraisal.find({ reviewer: reviewerId })
    .populate('participant')
    .populate('answers.questionId');
};

const updateAppraisal = async (id, data) => {
  return await Appraisal.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createAppraisal,
  getAppraisalsByParticipant,
  getAppraisalsByReviewer,
  updateAppraisal,
};
