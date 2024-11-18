const express = require('express');
const { signUp, login, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
