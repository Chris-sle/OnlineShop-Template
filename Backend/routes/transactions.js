const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/authentication.js');

const router = express.Router();