const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, validations, sanitizeData, xssClean } = require('../utils/validation');
const auth = require('../middleware/auth');

// Register route
router.post(
  '/register',
  sanitizeData,
  xssClean,
  validate(validations.registerUser),
  authController.register
);

// Login route
router.post(
  '/login',
  sanitizeData,
  xssClean,
  validate(validations.login),
  authController.login
);

// Get current user route
router.get(
  '/user',
  auth,
  authController.getUser
);

// Logout route
router.get(
  '/logout',
  auth,
  authController.logout
);

module.exports = router;