const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware.authenticateToken, authController.getProfile);
router.get('/users', authMiddleware.authenticateToken, authMiddleware.authorizeRole(['admin']), authController.getAllUsers);

module.exports = router;
