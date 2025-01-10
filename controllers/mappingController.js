const { createMapping, getMappingsByParticipant } = require('../services/mappingService');
const jwt = require('jsonwebtoken')
const { User } = require('../models/User');
const { Mapping } = require('../models/Mapping')
const mappingController = {
  // Controller to create a mapping
  createMapping: async (req, res, next) => {
    try {
      // Ensure only admin can create mappings
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only admins can create mappings.' });
      }

      const mapping = await createMapping({
        participant: req.body.participantId,
        supervisor: req.body.supervisorId,
        juniors: req.body.juniorsId,
        peers: req.body.peersId,
      });

      await mapping.save();

      res.status(201).json({
        success: true,
        message: 'Mapping created successfully.',
        mapping,
      });
    } catch (error) {
      next(error);
    }
  },

  // Controller to fetch mappings for a participant
  getMappings: async (req, res, next) => {

    try {

      const token = req.headers.authorization?.split(' ')[1];
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      //fetching user details
      const user = await User.findById({ _id: verified.id });

      if (user.role !== 'participant') res.status(400).json({ message: "You are not authorized" })
      else {

        const participantData = await Mapping.find({ participant: user._id });
        // console.log(participantData);
        res.status(200).json({ success: true, participantData });
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },
};

module.exports = mappingController;
