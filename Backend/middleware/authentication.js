const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        req.user = user;
        next();
    });
};

exports.checkAdmin = async (req, res, next) => {
    try {
        const [results] = await db.query(
            'SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id=?)',
            [req.user.id]
        );

        if (results.length === 0) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results[0].role_name === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!', error: err.message });
    }
};