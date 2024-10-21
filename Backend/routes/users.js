const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();

// Register new user
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

        // Generate a token payload
        const tokenPayload = { id: userId, email: userEmail, role: 'customer' }; // Set the role as guest for new users
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with a success message and token
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        next(error);
    }
});

// login with existing user
router.post('/login', async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    try {
        const [users] = await db.query(
            `SELECT users.*, roles.role_name 
            FROM users 
            JOIN roles ON users.role_id = roles.role_id 
            WHERE users.user_email = ?`,
            [userEmail]
        );

        if (users.length === 0) return res.status(400).json({ message: 'Incorrect email or password' });

        const user = users[0];
        const match = await bcrypt.compare(userPassword, user.user_password);

        if (match) {
            const tokenPayload = { id: user.user_id, email: user.user_email, role: user.role_name };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Incorrect email or password' });
        }
    } catch (err) {
        next(err);
    }
});

// Get user data
router.get('/userinfo', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        const [results] = await db.query(`
            SELECT users.*, userInfo.name, userInfo.date_of_birth, userAddresses.address, userAddresses.city, userAddresses.state, userAddresses.zipCode, userAddresses.country 
            FROM users 
            LEFT JOIN userInfo ON users.user_id = userInfo.user_id 
            LEFT JOIN userAddresses ON users.user_id = userAddresses.user_id 
            WHERE users.user_id = ?`, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    } catch (err) {
        next(err);
    }
});

// Edit user data
router.put('/userinfo', verifyToken, async (req, res, next) => {
    const userId = req.userId;
    const { name, date_of_birth, address, city, zipCode, country } = req.body; // Destructure fields

    try {
        // Check if userInfo exists
        const [existingUserInfo] = await db.query('SELECT * FROM userInfo WHERE user_id = ?', [userId]);

        if (existingUserInfo.length === 0) {
            // Insert with a new UUID if no entry exists
            const userInfoId = uuidv4();
            await db.query(`
                INSERT INTO userInfo (user_info_id, user_id, name, date_of_birth) 
                VALUES (?, ?, ?, ?)`,
                [userInfoId, userId, name || '', date_of_birth]
            );
        } else {
            // Update the existing entry
            await db.query(`
                UPDATE userInfo SET name = ?, date_of_birth = ? WHERE user_id = ?`,
                [name, date_of_birth, userId]
            );
        }

        // Check if userAddresses exists
        const [existingUserAddress] = await db.query('SELECT * FROM userAddresses WHERE user_id = ?', [userId]);

        if (existingUserAddress.length === 0) {
            // Insert with a new UUID if no entry exists
            const userAddressId = uuidv4();
            await db.query(`
                INSERT INTO userAddresses (user_address_id, user_id, address, city, zipCode, country)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [userAddressId, userId, address || '', city || '', zipCode || '', country || '']
            );
        } else {
            // Update the existing entry
            await db.query(`
                UPDATE userAddresses SET address = ?, city = ?, zipCode = ?, country = ? WHERE user_id = ?`,
                [address, city, zipCode, country, userId]
            );
        }

        res.json({ message: 'User information updated successfully' }); // Send a success response
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Get user's reviews
router.get('/reviews', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        const [reviews] = await db.query(`
            SELECT reviews.review_id, reviews.rating, reviews.comment, reviews.createdAt, products.product_name
            FROM reviews
            JOIN products ON reviews.product_id = products.product_id
            WHERE reviews.user_id = ?`,
            [userId]
        );

        res.json(reviews);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

module.exports = router;
