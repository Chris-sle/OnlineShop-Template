const express = require('express');
const { verifyToken, checkAdmin } = require('../middleware/authentication.js');

const router = express.Router();

router.get('/test', verifyToken, checkAdmin, async (req, res) => {
    try {
        res.send('This is an admin-only route');        
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;