const express = require('express');
const jwt = require('jsonwebtoken');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret';

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Mark attendance route (Protected)
router.post('/mark', authenticateToken, attendanceController.markAttendance);

// Get attendance records route (Protected)
router.get('/', authenticateToken, attendanceController.getAttendance);

module.exports = router;
