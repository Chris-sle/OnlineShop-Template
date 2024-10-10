const express = require('express');
const db = require('../config/db.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const [categories] = await db.query('SELECT category_id, category_name FROM categories');
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

router.get('/:categoryId/products', async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        const [products] = await db.query(`
            SELECT products.product_id, products.product_name, products.product_description, products.product_price, products.product_ImgUrl
            FROM products
            JOIN productCategories ON products.product_id = productCategories.product_id
            WHERE productCategories.category_id = ?
        `, [categoryId]);
        res.json(products);
    } catch (error) {
        next(error);
    }
});



module.exports = router;