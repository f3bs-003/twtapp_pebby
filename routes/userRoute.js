const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

// User routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
