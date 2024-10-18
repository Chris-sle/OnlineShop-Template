const express = require('express');
const { verifyToken } = require('../middleware/authentication.js');
const db = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// GET cart items for the user
router.get('/items', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        const [cartItems] = await db.query(`
            SELECT shopping_cart.product_id, shopping_cart.quantity, products.product_name, products.product_price, products.product_ImgUrl
            FROM shopping_cart
            JOIN products ON shopping_cart.product_id = products.product_id
            WHERE shopping_cart.user_id = ?`,
            [userId]
        );

        res.json(cartItems);
    } catch (error) {
        next(error);
    }
});

// Add or update a cart item
router.post('/items', verifyToken, async (req, res, next) => {
    const userId = req.userId;
    const { product_id, quantity } = req.body;

    try {
        const [existingItem] = await db.query(
            'SELECT * FROM shopping_cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existingItem.length > 0) {
            // Update the quantity to the new quantity directly
            await db.query(
                'UPDATE shopping_cart SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
                [quantity, userId, product_id]
            );
        } else {
            const cartId = uuidv4();
            await db.query(
                'INSERT INTO shopping_cart (cart_id, user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?, NOW())',
                [cartId, userId, product_id, quantity]
            );
        }

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        next(error);
    }
});


// Remove an item from the cart
router.delete('/items/:product_id', verifyToken, async (req, res, next) => {
    const userId = req.userId;
    const { product_id } = req.params;

    try {
        await db.query(
            'DELETE FROM shopping_cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        next(error);
    }
});

// Remove all items from the cart
router.delete('/items', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        await db.query(
            'DELETE FROM shopping_cart WHERE user_id = ?',
            [userId]
        );

        res.json({ message: 'All items removed from cart' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
