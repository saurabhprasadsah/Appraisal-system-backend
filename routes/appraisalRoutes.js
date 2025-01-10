const express = require('express');
const router = express.Router();
const appraisalController = require('../controllers/appraisalController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Create a new appraisal
router.post('/', auth, appraisalController.createAppraisal);

// Get appraisals for a participant (Admin and Supervisor)
router.get('/participant/:participantId', auth, authorize(['admin', 'supervisor']), appraisalController.getAppraisalsForParticipant);

// Get appraisals for a reviewer
router.get('/reviewer/:reviewerId', auth, appraisalController.getAppraisalsForReviewer);

// Update appraisal
router.put('/:id', auth, appraisalController.updateAppraisal);

module.exports = router;
