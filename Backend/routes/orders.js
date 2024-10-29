const express = require('express');
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();

router.get('/user-orders', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        const [ordersData] = await db.query(`
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

        const orders = {};
        ordersData.forEach(order => {
            const { transaction_id } = order;

            if (!orders[transaction_id]) {
                orders[transaction_id] = {
                    transaction_id: order.transaction_id,
                    total_amount: order.total_amount,
                    current_status: order.current_status,
                    createdAt: order.createdAt,
                    address: order.address,
                    city: order.city,
                    zipCode: order.zipCode,
                    country: order.country,
                    products: [] // Initialize products as an empty array
                };
            }

            // Add products to the order if they exist
            if (order.product_name) {
                orders[transaction_id].products.push({
                    product_name: order.product_name,
                    quantity: order.quantity,
                    priceAtPurchase: order.priceAtPurchase
                });
            }
        });

        // Convert the orders object back to an array
        res.status(200).json(Object.values(orders));
    } catch (error) {
        next(error);
    }
});

// New endpoint for cancelling an order
router.put('/user-orders/:transaction_id/cancel', verifyToken, async (req, res, next) => {
    const { transaction_id } = req.params;
    const userId = req.userId;

    try {
        // Check if the order can be canceled
        const [order] = await db.query(
            'SELECT current_status FROM transactions WHERE transaction_id = ? AND costumer_id = ?',
            [transaction_id, userId]
        );

        if (!order.length || order[0].current_status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be canceled' });
        }

        // Update order status
        await db.query(
            'UPDATE transactions SET current_status = "Cancelled" WHERE transaction_id = ?',
            [transaction_id]
        );

        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;