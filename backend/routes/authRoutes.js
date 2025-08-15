const express = require('express');
const router = express.Router();
const { loginUser, signup, verifyToken, logout, updateProfile, testCookies} = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', signup);
router.get('/verify-token', verifyToken);
router.post('/logout', logout);
router.put('/update-profile', updateProfile);
router.get('/test-cookies', testCookies);

module.exports = router;

