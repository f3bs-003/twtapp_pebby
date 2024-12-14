// const pool = require('../config/database');
// const bcrypt = require ('bcryptjs');
// const jwt = require('jsonwebtoken');

// const register = async (req, res) => {
//     const { fullname, username, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const [rows] = await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);

//         res.status(201).json({ message: 'User registered succesfully!'});
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }

// };

// const login = async (req, res) => {
//     const {username, password} = req.body;

//     try {
//         const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

//         if (rows.length === 0) {
//             return res.status(400).json({ error: 'Invalid Credentials'});
//         }

//         const user = rows[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid Credentials' });
//         }

//         const token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME });

//         res.json({ token });

//     } catch (err) {
        
//         res.status(500).json({ error: err.message});
//     }
// };

// module.exports = { register, login };

const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { fullname, username, password } = req.body;

    try {
        // Check if username already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)',
            [fullname, username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred during registration: ' + err.message });
    }
};

// Login a user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user by username
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials. Please try again.' });
        }

        const user = rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials. Please try again.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || '1h' }
        );

        res.json({ token, message: 'Login successful!' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred during login: ' + err.message });
    }
};

module.exports = { register, login };
