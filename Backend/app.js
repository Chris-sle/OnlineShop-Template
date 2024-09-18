require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

// Use Helmet for security
app.use(helmet()); // Must learn what can do.

// Allow requests from http://localhost:5173
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server-cert.pem'))
};

https.createServer(options, app).listen(APP_PORT, () => {
    console.log(`Server is running on https://localhost:${APP_PORT}`);
});