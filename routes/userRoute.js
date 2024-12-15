const express = require('express');
const { register, login, getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// User Routes
router.get('/', authenticateToken, getAllUsers); // Get all users
router.get('/:id', authenticateToken, getUserById); // Get a single user by ID
router.post('/', authenticateToken, createUser); // Create a new user
router.put('/:id', authenticateToken, updateUser); // Update an existing user by ID
router.delete('/:id', authenticateToken, deleteUser); // Delete a user by ID

module.exports = router;

