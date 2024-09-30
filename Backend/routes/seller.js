const express = require('express');
const db = require('../config/db.js');
const { verifyToken, checkSellerOrAdmin } = require('../middleware/authentication.js');

const router = express.Router();

// Get products for current seller
router.get('/products', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const userId = req.userId;
    try {
        const [products] = await db.query('SELECT * FROM products WHERE seller_id = ?', [userId]);
        res.json(products);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Add new product
router.post('/products', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const userId = req.userId;
    const { product_name, product_description, product_price, product_ImgUrl } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO products (product_id, seller_id, product_name, product_description, product_price, product_ImgUrl, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW())',
            [userId, product_name, product_description, product_price, product_ImgUrl]
        );
        res.json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Edit existing product
router.put('/products/:id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { product_name, product_description, product_price, product_ImgUrl } = req.body;

    try {
        await db.query(
            'UPDATE products SET product_name=?, product_description=?, product_price=?, product_ImgUrl=?, updatedAt=NOW() WHERE product_id=? AND seller_id=?',
            [product_name, product_description, product_price, product_ImgUrl, id, req.userId]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

//Remove a product
router.delete('/products/:id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM products WHERE product_id = ? AND seller_id = ?', [id, req.userId]);
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Export the router
module.exports = router;