const express = require('express');
const { verifyToken, checkAdmin } = require('../middleware/authentication.js');

const router = express.Router();

router.get('/only', verifyToken, checkAdmin, (req, res) => {
    res.send('This is an admin-only route');
});

module.exports = router;