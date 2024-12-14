const pool = require('../config/database');

// Create a new post
const createPost = async (req, res) => {
    const { user_id, image, caption } = req.body;

    try {
        // Insert the new post into the database
        const [result] = await pool.query(
            'INSERT INTO posts (user_id, image, caption) VALUES (?, ?, ?)',
            [user_id, image, caption]
        );

        res.status(201).json({
            message: 'Post created successfully!',
            post_id: result.insertId,
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the post: ' + err.message });
    }
};

// Get all posts (optionally for a specific user)
const getPosts = async (req, res) => {
    const { user_id } = req.query; // Optional query parameter to filter posts by user

    try {
        let query = 'SELECT posts.*, users.username, users.fullname FROM posts JOIN users ON posts.user_id = users.user_id';
        const params = [];

        if (user_id) {
            query += ' WHERE posts.user_id = ?';
            params.push(user_id);
        }

        query += ' ORDER BY posts.created_at DESC';

        const [rows] = await pool.query(query, params);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching posts: ' + err.message });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    const { post_id } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT posts.*, users.username, users.fullname FROM posts JOIN users ON posts.user_id = users.user_id WHERE posts.post_id = ?',
            [post_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the post: ' + err.message });
    }
};

// Delete a post by ID
const deletePost = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.body; // Ensure the user deleting the post owns it

    try {
        // Check if the post exists and belongs to the user
        const [rows] = await pool.query('SELECT * FROM posts WHERE post_id = ? AND user_id = ?', [post_id, user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        // Delete the post
        await pool.query('DELETE FROM posts WHERE post_id = ?', [post_id]);

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the post: ' + err.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    deletePost,
};
