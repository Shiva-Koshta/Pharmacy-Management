const express = require('express');
const router = express.Router();
const { loginUser, signup, verifyToken} = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', signup);
router.get('/verify-token', verifyToken);

module.exports = router;

