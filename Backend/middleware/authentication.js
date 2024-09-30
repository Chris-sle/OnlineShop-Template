const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        req.userId = decoded.id
        req.role = decoded.role;
        next();
    });
};

exports.checkAdmin = async (req, res, next) => {
    try {
        const [results] = await db.query(
            'SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id=?)',
            [req.userId]
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

// make a seller middleware that also admins can use.
exports.checkSellerOrAdmin = async (req, res, next) => {
    try {
        // Fetch the user's role based on their user ID from the JWT payload
        const [results] = await db.query(
            'SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id=?)',
            [req.userId] // Use req.userId set by verifyToken middleware
        );

        if (results.length === 0) {
            return res.status(500).json({ message: 'Database error: Unable to determine user role' });
        }

        const role = results[0].role_name;

        // Check if the role is either 'seller' or 'admin'
        if (role === 'seller' || role === 'admin') {
            next(); // Proceed if user is a seller or an admin
        } else {
            res.status(403).json({ message: 'Forbidden: Sellers or Admins only' });
        }
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!', error: err.message });
    }
};
