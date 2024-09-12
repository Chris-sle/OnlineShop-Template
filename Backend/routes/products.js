const express = require('express');
const db = require('../config/db.js');

const router = express.Router();

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
});

// Here you'd implement other product-related routes like creating and updating products

module.exports = router;