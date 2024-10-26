// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const authenticateToken = require('../middlewares/authMiddleware'); // Import the authentication middleware
const calculateCaloriesMiddleware = require('../middlewares/calculateCalories');
const userRouter = express.Router();

// Replace 'your_jwt_secret' with an environment variable or a secure key
const JWT_SECRET = '4a751785ea0a685ec4d98f1d25b17730bae31ad1fbf1310cda8069a90bce2b47';

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
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client("225589132267-2mbhelusrktjd8j7m8u3mkbj7fbtlvmt.apps.googleusercontent.com");


const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Add your client origin here
];

userRouter.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

userRouter.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "225589132267-2mbhelusrktjd8j7m8u3mkbj7fbtlvmt.apps.googleusercontent.com",
    });
    console.log(ticket)
    const payload = ticket.getPayload();
    console.log(payload)
    const username = payload?.email; // Use email as the unique identifier
    
    // Check if user already exists
    
    let user = await User.findOne({ username });
    
    if (!user) {
      password='dsa'
      // If the user does not exist, create a new one
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword });
      await user.save();
    }

    res.status(200).json({ message: "User authenticated successfully" });
  } catch (error) {
    console.error('Google authentication failed:', error);
    res.status(401).json({ message: "Invalid token" });
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

    // Generate a JWT token with the user's _id
    const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Signin successful', token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to update user details
userRouter.put('/update-details', authenticateToken, async (req, res, next) => {
  const { firstname, age, weight, height, gender, goal, country, zipcode, activityLevel } = req.body;

  try {
    console.log('Authenticated user ID:', req.user._id);

    // Find the user by ID in the database
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('No user found with ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.firstname = firstname;
    user.age = age;
    user.weight = weight;
    user.height = height;
    user.gender = gender;
    user.goal = goal;
    user.country = country;
    user.zipcode = zipcode;
    user.activityLevel = activityLevel;

    req.user = user; // Pass the user object to the middleware

    // Use the middleware to calculate and update daily calorie requirement
    next();
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}, calculateCaloriesMiddleware, async (req, res) => {
  try {
    // Save the updated user information, including the daily calorie requirement
    req.user.calorieRequirement = req.user.dailyCalorieRequirement;  // Save calorie requirement
    await req.user.save();

    res.json({
      message: 'User details updated successfully',
      dailyCalorieRequirement: req.user.dailyCalorieRequirement,
      user: req.user
    });
  } catch (error) {
    console.error('Error saving user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
