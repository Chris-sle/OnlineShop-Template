const express = require('express');
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();

router.get('/user-orders', verifyToken, async (req, res, next) => {
    const userId = req.userId; // Get userId from the token

    try {
        const [orders] = await db.query(`
            SELECT 
                t.transaction_id, 
                t.total_amount, 
                t.current_status, 
                t.createdAt,
                ua.address,
                ua.city,
                ua.zipCode,
                ua.country,
                p.product_name,
                ti.quantity,
                ti.priceAtPurchase
            FROM transactions t
            LEFT JOIN transactionItems ti ON t.transaction_id = ti.transaction_id
            LEFT JOIN products p ON ti.product_id = p.product_id
            LEFT JOIN userAddresses ua ON t.costumer_id = ua.user_id
            WHERE t.costumer_id = ?
            ORDER BY t.createdAt DESC
        `, [userId]);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
