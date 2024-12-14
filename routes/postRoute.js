const express = require('express');
const { createPost, getPosts, getPostById, deletePost } = require('../controllers/postController');

const router = express.Router();

// Post routes
router.post('/', createPost);           // Create a post
router.get('/', getPosts);              // Get all posts
router.get('/:post_id', getPostById);   // Get a single post by ID
router.delete('/:post_id', deletePost); // Delete a post

module.exports = router;
