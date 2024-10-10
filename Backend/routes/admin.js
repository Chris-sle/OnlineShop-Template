const express = require('express');
const { verifyToken, checkAdmin } = require('../middleware/authentication.js');
const db = require('../config/db.js');

const router = express.Router();

// View all users.
router.get('/users', verifyToken, checkAdmin, async (req, res, next) => {
    try {
        const [users] = await db.query(`
            SELECT users.user_id, users.user_email, roles.role_name, users.createdAt 
            FROM users 
            JOIN roles ON users.role_id = roles.role_id
        `);
        res.json(users);
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
}); 

// Change user role
router.put('/users/:id/role', verifyToken, checkAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { newRole } = req.body;

    try {
        const [role] = await db.query('SELECT role_id FROM roles WHERE role_name = ?', [newRole]);
        if (!role.length) return res.status(404).json({ message: 'Role not found' });

        await db.query('UPDATE users SET role_id = ? WHERE user_id = ?', [role[0].role_id, id])
        res.json({ message: 'User role updated successfully' });

    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Delete user
router.delete('/users/:id', verifyToken, checkAdmin, async (req, res, next) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        res.json({ message: 'User removed successfully'});

    } catch (error) {
        next(error); // Pass errors to the error handler
    }
})

// Export module
module.exports = router;