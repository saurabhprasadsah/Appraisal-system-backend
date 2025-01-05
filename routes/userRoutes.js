const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/', auth, checkRole(['admin']), userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, checkRole(['admin']), userController.updateUser);
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);


// // Additional routes for userRoutes.js
router.get('/role/:role', auth, checkRole(['admin']), userController.getUsersByRole);
// router.get('/stats', auth, checkRole(['admin']), userController.getUserStats);
router.patch('/:id/deactivate', auth, checkRole(['admin']), userController.deactivateUser);
router.patch('/:id/reactivate', auth, checkRole(['admin']), userController.reactivateUser);

module.exports = router;