const express = require('express');
const fs = require('fs');
const https = require('https');
const mysql = require('mysql2');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

require("dotenv").config();

const APP_PORT = process.env.APP_PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database')
});

app.use(express.json());

// Verify the token provided by users and extract their roles. 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Forbidden');

        // Attach the user to the request object.
        req.user = user;
        next();
    });
};
// CRUD for registering new users and login
app.post('/register', async (req, res) => {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const userId = uuidv4(); // Generate a new UUID for user_id
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        const createdAt = new Date(); // Use the current date for CreatedAt

        db.query('INSERT INTO users (user_id, user_email, user_password, CreatedAt) VALUES (?, ?, ?, ?)', 
        [userId, userEmail, hashedPassword, createdAt], (err, result) => {
            if (err) {
                console.error('Database Insert Error: ', err);
                res.status(500).send('Error registering user');
            } else {
                res.send('User registered successfully');
            }
        });
    } catch (error) {
        console.error('Server Error: ', error);
        res.status(500).send('Server error');
    }
});


app.post('/login', (req, res) => {
    const { userEmail, userPassword } = req.body;

    db.query('SELECT * FROM users WHERE user_email = ?', [userEmail], async (err, users) => {
        if (err) {
            return res.status(500).send('Error fetching user');
        }

        if (users.length === 0) {
            return res.status(400).send('Incorrect email or password');
        }

        const user = users[0];
        const match = await bcrypt.compare(userPassword, user.user_password);

        if (match) {
            // Payload with user information, can include role or user ID
            const tokenPayload = { id: user.user_id, email: user.user_email };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).send('Incorrect email or password');
        }
    });
});

// CRUD for users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
        }
        res.json(results);
    });
});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID', sql.Int, userId)
            .query('SELECT * FROM users WHERE ID = @ID');

        if (result.recordset.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// CRUD for products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) {
            res.status(500).send('Error fetching products');
        }
        res.json(result);
    });
});

// CRUD for transactions
app.get('/transactions', (req, res) => {
    db.query('SELECT * FROM transactions', (err, result) => {
        if (err) {
            res.status(500).send('Error fetching products');
        }
        res.json(result);
    });
});

// Check and CRUD for admin
const checkAdmin = (req, res, next) => {
    const userId = req.user.id;

    db.query('SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id = ?)', [userId], (err, results) => {
        if (err) return res.status(500).send('Database error');

        if (results[0].role_name === 'admin') {
            next(); // User is admin, continue
        } else {
            res.status(403).send('Forbidden: Admins only');
        }
    });
};

app.get('/admin/only', verifyToken, checkAdmin, (req, res) => {
    res.send('This is an admin-only route');
});

// HTTPS Options
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server-cert.pem'))
};

// Create HTTPS server
https.createServer(options, app).listen(APP_PORT, () => {
    console.log(`Server is running on https://localhost:${APP_PORT}`);
});