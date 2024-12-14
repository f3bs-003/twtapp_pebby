const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({ error: 'Entry prohibited' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token not recognized.' });
    }
};

module.exports = authenticateToken; 

