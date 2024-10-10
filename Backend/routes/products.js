const express = require('express');
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();

// Public
// Get all products for product page.
router.get('/all', async (req, res, next) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        next(error)
    }
});

router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {
        const [product] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId])
        res.json(product)
    } catch (error) {
        next(error)
    }
});

// show reviews for product
router.get('/:productId/reviews', async (req, res, next) => {
    const { productId } = req.params;
    try {
        const [reviews] = await db.query(`
            SELECT reviews.review_id, reviews.rating, reviews.comment, users.user_email, reviews.createdAt
            FROM reviews
            JOIN users ON reviews.user_id = users.user_id
            WHERE reviews.product_id = ?
        `, [productId]);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

// With Token
// Add a review
router.post('/:productId/reviews', verifyToken, async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = req;  // Assume userId is set in verifyToken middleware

    try {
        await db.query(`
            INSERT INTO reviews (review_id, product_id, user_id, rating, comment, createdAt)
            VALUES (UUID(), ?, ?, ?, ?, NOW())
        `, [productId, userId, rating, comment]);
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        next(error);
    }
});

// Export module
module.exports = router;