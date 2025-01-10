const express = require('express');
const router = express.Router();
const mappingController = require('../controllers/mappingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const toValidateUsers=require('../middleware/toValidateUsers.js');
// Route to create a new mapping (Admin only)
router.post('/', auth, authorize(['admin']), toValidateUsers, mappingController.createMapping);

// Route to fetch mappings for a participant
router.get('/get-participant-data', auth, mappingController.getMappings);

module.exports = router;
