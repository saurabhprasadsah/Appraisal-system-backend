const { Mapping } = require('../models/Mapping');

// Service to create a new mapping
const createMapping = async (data) => {
  return await Mapping.create(data);
};

// Service to fetch mappings by participant ID
const getMappingsByParticipant = async (participantId) => {
  return await Mapping.find({ participant: participantId }).populate('supervisor peers juniors');
};

module.exports = {
  createMapping,
  getMappingsByParticipant,
};
