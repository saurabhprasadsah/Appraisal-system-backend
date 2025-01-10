const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Route to create the first admin
router.post('/create-admin', authController.createAdmin);

// Register route (Admin only)
router.post('/register', auth, authorize(['admin']), authController.register);
// Login route
router.post('/login', authController.login);
// Get current user
router.get('/user', auth, authController.getUser);

module.exports = router;
