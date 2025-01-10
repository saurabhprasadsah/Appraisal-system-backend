const Mapping = require('../models/Mapping');
const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');

exports.createMapping = async (req, res, next) => {
  try {
    const { participant, supervisor, peers, juniors } = req.body;

    const supervisorUser = await User.findById(supervisor);
    if (!supervisorUser || supervisorUser.role !== 'supervisor') {
      throw new AppError('Invalid supervisor', 400);
    }

    const existingMapping = await Mapping.findOne({ participant });
    if (existingMapping) {
      throw new AppError('Mapping already exists for this participant', 400);
    }

    const mapping = await Mapping.create(req.body);
    
    res.status(201).json({
      success: true,
      data: mapping
    });
  } catch (error) {
    next(error);
  }
};

exports.getParticipantMapping = async (req, res, next) => {
  try {
    const mapping = await Mapping.findOne({ participant: req.params.participantId })
      .populate('supervisor', 'name email')
      .populate('peers', 'name email')
      .populate('juniors', 'name email');

    if (!mapping) {
      throw new AppError('Mapping not found', 404);
    }

    res.json({
      success: true,
      data: mapping
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMapping = async (req, res, next) => {
  try {
    const mapping = await Mapping.findOneAndUpdate(
      { participant: req.params.participantId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mapping) {
      throw new AppError('Mapping not found', 404);
    }

    res.json({
      success: true,
      data: mapping
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMapping = async (req, res, next) => {
  try {
    const mapping = await Mapping.findOneAndDelete({ 
      participant: req.params.participantId 
    });

    if (!mapping) {
      throw new AppError('Mapping not found', 404);
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};