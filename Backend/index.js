// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user'); // Import the user router
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS to allow requests from your frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://mhimeksh:himi2106@cluster0.m4gr0.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the user router
app.use('/api', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
