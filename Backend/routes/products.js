const express = require('express');
const db = require('../config/db.js');

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM products');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.mesage });
    }
});


module.exports = router;