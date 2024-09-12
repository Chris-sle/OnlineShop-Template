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

exports.checkAdmin = (req, res, next) => {
    const userId = req.user.id;

    db.query('SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id = ?)', [userId], (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ message: 'Database error' });

        if (results[0].role_name === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    });
};