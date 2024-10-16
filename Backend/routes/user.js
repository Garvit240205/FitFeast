// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user'); // Import the User model
const userRouter = express.Router();

// Replace 'your_jwt_secret' with an environment variable or a secure key
const JWT_SECRET = '4a751785ea0a685ec4d98f1d25b17730bae31ad1fbf1310cda8069a90bce2b47';

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://mhimeksh:himi2106@cluster0.m4gr0.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Signup endpoint
userRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signin endpoint
userRouter.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Signin successful', token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

// Protected route example
userRouter.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Meal-related routes (protected)
userRouter.post('/meal', authenticateToken, (req, res) => {
  res.json({ message: 'User meal endpoint to post a meal' });
});

userRouter.put('/meal', authenticateToken, (req, res) => {
  res.json({ message: 'User meal endpoint to update a meal' });
});

userRouter.delete('/meal', authenticateToken, (req, res) => {
  res.json({ message: 'User meal endpoint to delete a meal' });
});

userRouter.get('/meal/preview', authenticateToken, (req, res) => {
  res.json({ message: 'User meal endpoint to view all the meals logged' });
});

module.exports = userRouter;
