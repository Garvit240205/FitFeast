// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Replace 'your_jwt_secret' with an environment variable or a secure key
const JWT_SECRET = '4a751785ea0a685ec4d98f1d25b17730bae31ad1fbf1310cda8069a90bce2b47';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
