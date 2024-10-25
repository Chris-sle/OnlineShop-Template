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
        // Generate new IDs for the product and its category
        const productId = uuidv4();

        // Insert into products table
        await db.query(
            'INSERT INTO products (product_id, seller_id, product_name, product_description, product_price, product_ImgUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [productId, userId, product_name, product_description, product_price, product_ImgUrl]
        );

        // Insert into productCategories table (only if category_id is valid)
        if (category_id) {
            const productCategoryId = uuidv4();
            await db.query(
                'INSERT INTO productCategories (productCategory_id, product_id, category_id) VALUES (?, ?, ?)',
                [productCategoryId, productId, category_id]
            );
        }

        // Response includes complete product information
        res.json({
            message: 'Product added successfully',
            product: {
                product_id: productId,
                seller_id: userId,
                product_name,
                product_description,
                product_price,
                product_ImgUrl,
                category_id
            }
        });
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

// Orders for seller
router.get('/orders/:id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { id } = req.params; // Get seller_id from path

    try {
        const [orders] = await db.query(`
            SELECT 
                t.transaction_id, 
                t.total_amount, 
                t.current_status, 
                t.createdAt, 
                ui.name AS customer_name,
                u.user_email AS customer_email,  -- Referencing user_email from the users table
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
            LEFT JOIN userInfo ui ON t.costumer_id = ui.user_id  -- Join to get the user's name
            LEFT JOIN users u ON t.costumer_id = u.user_id  -- Join to get the user's email
            WHERE p.seller_id = ?
            ORDER BY t.createdAt DESC
        `, [id]);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});


// Route for updating order status
router.put('/orders/:transaction_id', verifyToken, checkSellerOrAdmin, async (req, res, next) => {
    const { transaction_id } = req.params;
    const { newStatus } = req.body;  // Expect newStatus to be passed in the request body

    try {
        await db.query(
            'UPDATE transactions SET current_status = ?, updatedAt = NOW() WHERE transaction_id = ?',
            [newStatus, transaction_id]
        );

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        next(error);
    }
});

// Export the router
module.exports = router;