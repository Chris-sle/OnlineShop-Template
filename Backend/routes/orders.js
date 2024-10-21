const express = require('express');
const db = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');  // Import UUID for unique identifiers
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();

router.post('/checkout/guest', async (req, res, next) => {
    const { items, totalAmount, customerInfo } = req.body; // Extract customer info from request
    const transactionId = uuidv4(); // Unique transaction ID
    const guestUserId = uuidv4(); // Unique user ID for the guest entry

    try {
        // Lookup the role_id for the guest
        const [role] = await db.query('SELECT role_id FROM roles WHERE role_name = ?', ['guest']);
        
        // Insert the customer information into the users table with the 'Guest' role.
        await db.query(
            'INSERT INTO users (user_id, user_email, user_password, role_id, createdAt) VALUES (?, ?, ?, ?, ?)',
            [guestUserId, customerInfo.email, null, role.role_id, new Date()] // Use retrieved role_id here
        );

        // Insert customer name into userInfo table
        await db.query(
            'INSERT INTO userInfo (user_info_id, user_id, name) VALUES (?, ?, ?)',
            [uuidv4(), guestUserId, customerInfo.name]
        );

        // Insert address details into userAddresses table
        await db.query(
            'INSERT INTO userAddresses (user_address_id, user_id, address, city, zipCode, country) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), guestUserId, customerInfo.address, customerInfo.city, customerInfo.zipCode, customerInfo.country]
        );

        // Insert transaction
        await db.query(
            'INSERT INTO transactions (transaction_id, costumer_id, total_amount, current_status, createdAt) VALUES (?, ?, ?, ?, ?)',
            [transactionId, guestUserId, totalAmount, 'Pending', new Date()]
        );

        // Insert transaction items
        const insertPromises = items.map(item => {
            return db.query(
                'INSERT INTO transactionItems (transactionItem_id, transaction_id, product_id, quantity, priceAtPurchase) VALUES (?, ?, ?, ?, ?)',
                [uuidv4(), transactionId, item.product_id, item.quantity, item.price]
            );
        });

        await Promise.all(insertPromises);

        res.status(201).json({ message: 'Order created successfully for guest' });
    } catch (error) {
        next(error);
    }
});

router.post('/checkout/user', verifyToken, async (req, res, next) => {
    const { items, totalAmount } = req.body;
    const userId = req.userId; // Assume userId is attached by verifyToken
    const transactionId = uuidv4(); // Unique transaction ID

    try {
        // Insert transaction with userId
        await db.query(
            'INSERT INTO transactions (transaction_id, costumer_id, total_amount, current_status, createdAt) VALUES (?, ?, ?, ?, ?)',
            [transactionId, userId, totalAmount, 'Pending', new Date()]
        );

        // Insert transaction items
        const insertPromises = items.map(item => {
            return db.query(
                'INSERT INTO transactionItems (transactionItem_id, transaction_id, product_id, quantity, priceAtPurchase) VALUES (?, ?, ?, ?, ?)',
                [uuidv4(), transactionId, item.product_id, item.quantity, item.price]
            );
        });

        await Promise.all(insertPromises);
        res.status(201).json({ message: 'Order created successfully for user' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
