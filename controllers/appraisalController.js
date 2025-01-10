const {
  createAppraisal,
  getAppraisalsByParticipant,
  getAppraisalsByReviewer,
  updateAppraisal,
} = require('../services/appraisalService');

const appraisalController = {
  createAppraisal: async (req, res, next) => {
    try {
      const appraisal = await createAppraisal(req.body);
      res.status(201).json(appraisal);
    } catch (error) {
      next(error);
    }
  },

  getAppraisalsForParticipant: async (req, res, next) => {
    try {
      const appraisals = await getAppraisalsByParticipant(req.params.participantId);
      res.json(appraisals);
    } catch (error) {
      next(error);
    }
  },

  getAppraisalsForReviewer: async (req, res, next) => {
    try {
      const appraisals = await getAppraisalsByReviewer(req.params.reviewerId);
      res.json(appraisals);
    } catch (error) {
      next(error);
    }
  },

  updateAppraisal: async (req, res, next) => {
    try {
      const appraisal = await updateAppraisal(req.params.id, req.body);
      res.json(appraisal);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = appraisalController;
