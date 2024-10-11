const express = require('express');
const { verifyToken, checkAdmin } = require('../middleware/authentication.js');
const db = require('../config/db.js');
const { v4: uuidv4 } = require('uuid'); 

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
        res.json({ message: 'User removed successfully' });

    } catch (error) {
        next(error); // Pass errors to the error handler
    }
})

// Add a category
router.post('/categories', verifyToken, checkAdmin, async (req, res, next) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const categoryId = uuidv4(); // Generate a new UUID for the category
        await db.query('INSERT INTO categories (category_id, category_name) VALUES (?, ?)', [categoryId, categoryName]);
        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Category name already exists' });
        } else {
            next(error); // Pass errors to the error handler
        }
    }
});

// Delete a category
router.delete('/categories/:categoryId', verifyToken, checkAdmin, async (req, res, next) => {
    const { categoryId } = req.params;

    try {
        await db.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
        res.json({ message: 'Category removed successfully' });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

// Export module
module.exports = router;