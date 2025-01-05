const express = require('express');
const router = express.Router();
const appraisalController = require('../controllers/appraisalController');
const auth = require('../middleware/auth');
const { validate, validations } = require('../utils/validation');

// Define routes with proper middleware and controller functions
router.post('/',
  auth,
  validate(validations.createAppraisal),
  appraisalController.createAppraisal
);

router.get('/participant/:id',
  auth,
  appraisalController.getParticipantAppraisals
);

router.get('/reviewer/:id',
  auth,
  appraisalController.getReviewerAppraisals
);

router.put('/:id',
  auth,
  appraisalController.updateAppraisal
);

router.get('/:id',
  auth,
  appraisalController.getAppraisal
);

module.exports = router;