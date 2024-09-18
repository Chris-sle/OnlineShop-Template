const express = require('express');
const db = require('../config/db.js');

const router = express.Router();

router.get('/all', (req, res, next) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
});


module.exports = router;