const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 1. Diiwaangelinta (Public)
router.post('/register', register);

// 2. Soo gelitaanka (Public)
router.post('/login', login);

module.exports = router;