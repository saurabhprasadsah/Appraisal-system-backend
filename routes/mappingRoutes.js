const express = require('express');
const router = express.Router();
const {
  createMapping,
  getParticipantMapping,
  updateMapping,
  deleteMapping
} = require('../controllers/mappingController');
const auth = require('../middleware/auth');

// Define routes
router.post('/', auth, createMapping);
router.get('/:participantId', auth, getParticipantMapping);
router.put('/:participantId', auth, updateMapping);
router.delete('/:participantId', auth, deleteMapping);

module.exports = router;