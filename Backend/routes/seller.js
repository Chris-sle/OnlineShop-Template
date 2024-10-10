const express = require('express');
const db = require('../config/db.js');
const { verifyToken, checkSellerOrAdmin } = require('../middleware/authentication.js');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get products for current seller
router.get('/products', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const userId = req.userId;
    try {
        const [products] = await db.query(`
            SELECT products.*, productCategories.category_id
            FROM products
            LEFT JOIN productCategories ON products.product_id = productCategories.product_id
            WHERE products.seller_id = ?
            `, [userId]);
        res.json(products);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Add new product
router.post('/products', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const userId = req.userId;
    const { product_name, product_description, product_price, product_ImgUrl, category_id } = req.body;

    try {
        const productId = uuidv4();
        const productCategory_id = uuidv4();

        // Insert into products table
        await db.query(
            'INSERT INTO products (product_id, seller_id, product_name, product_description, product_price, product_ImgUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [productId, userId, product_name, product_description, product_price, product_ImgUrl]
        );

        // Insert into productCategories table
        await db.query(
            'INSERT INTO productCategories (productCategory_id, product_id, category_id) VALUES (?, ?, ?)',
            [productCategory_id, productId, category_id]
        );

        res.json({ message: 'Product added successfully', productId }); // Return the generated productId
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Edit existing product
router.put('/products/:id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { product_name, product_description, product_price, product_ImgUrl, category_id } = req.body; // Include category_id

    try {
        // Update the product details
        await db.query(
            'UPDATE products SET product_name=?, product_description=?, product_price=?, product_ImgUrl=?, updatedAt=NOW() WHERE product_id=? AND seller_id=?',
            [product_name, product_description, product_price, product_ImgUrl, id, req.userId]
        );

        // Update the product category
        await db.query(
            'INSERT INTO productCategories (productCategory_id, product_id, category_id) VALUES (UUID(), ?, ?) ON DUPLICATE KEY UPDATE category_id = ?',
            [id, category_id, category_id] // This assumes `product_id` is unique in `productCategories`
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Update product category
router.put('/products/:id/category', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { category_id } = req.body;

    try {
        // Check if the product-category association exists
        const [exists] = await db.query(`
            SELECT * FROM productCategories WHERE product_id = ?`, [id]);

        if (exists.length > 0) {
            // Update if exists
            const [result] = await db.query(
                'UPDATE productCategories SET category_id = ? WHERE product_id = ?',
                [category_id, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product or category not found' });
            }
        } else {
            // Insert a new association if it doesn't exist
            await db.query(
                'INSERT INTO productCategories (productCategory_id, product_id, category_id) VALUES (UUID(), ?, ?)',
                [id, category_id]
            );
        }

        res.json({ message: 'Product category updated successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

//Remove a product
router.delete('/products/:id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params;
    
    try {
        // First, delete the associations in productCategories
        await db.query('DELETE FROM productCategories WHERE product_id = ?', [id]);
        
        // Then delete the product itself
        const [result] = await db.query('DELETE FROM products WHERE product_id = ? AND seller_id = ?', [id, req.userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or you are not authorized to delete this product' });
        }

        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Export the router
module.exports = router;