const Appraisal = require('../models/Appraisal'); 

const appraisalController = {
  createAppraisal: async (req, res) => {
    try {
      const appraisal = new Appraisal(req.body);
      await appraisal.save();
      res.status(201).json(appraisal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get appraisals where user is participant
  getParticipantAppraisals: async (req, res) => {
    try {
      const appraisals = await Appraisal.find({ participantId: req.params.id });
      res.json(appraisals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get appraisals where user is reviewer
  getReviewerAppraisals: async (req, res) => {
    try {
      const appraisals = await Appraisal.find({ reviewerId: req.params.id });
      res.json(appraisals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update appraisal
  updateAppraisal: async (req, res) => {
    try {
      const appraisal = await Appraisal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!appraisal) {
        return res.status(404).json({ message: 'Appraisal not found' });
      }
      res.json(appraisal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single appraisal
  getAppraisal: async (req, res) => {
    try {
      const appraisal = await Appraisal.findById(req.params.id);
      if (!appraisal) {
        return res.status(404).json({ message: 'Appraisal not found' });
      }
      res.json(appraisal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = appraisalController;