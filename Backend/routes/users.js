const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db.js');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        const createdAt = new Date();

        await db.query(
            'INSERT INTO users (user_id, user_email, user_password, role_id, createdAt) VALUES (?, ?, ?, (SELECT role_id FROM roles WHERE role_name="customer"), ?)',
            [userId, userEmail, hashedPassword, createdAt]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE user_email = ?', [userEmail]);

        if (users.length === 0) return res.status(400).json({ message: 'Incorrect email or password' });

        const user = users[0];
        const match = await bcrypt.compare(userPassword, user.user_password);

        if (match) {
            const tokenPayload = { id: user.user_id, email: user.user_email };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Incorrect email or password' });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const [results] = await db.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    const userId = req.params.id;

    try {
        const [results] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
