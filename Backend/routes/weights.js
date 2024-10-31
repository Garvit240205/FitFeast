const express = require('express');
const weightRouter = express.Router();
const Weight = require('../models/weights');
const authenticateToken  = require('../middlewares/authMiddleware'); // Assuming this middleware validates tokens and sets req.user

// Get weights for the past week for a specific user
weightRouter.get('/weights', authenticateToken, async (req, res) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  console.log('to get weights entered!');
  try {
    const weights = await Weight.find({
      user_id: req.user._id, // Filter by user ID
      day: { $gte: lastWeek.toISOString().split('T')[0] }
    });
    res.status(201).json(weights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new weight entry for a specific user
weightRouter.post('/weights', authenticateToken, async (req, res) => {
  const { day, weight } = req.body;

  const newWeight = new Weight({
    user_id: req.user._id, // Associate weight entry with user ID
    day,
    weight
  });

  try {
    const savedWeight = await newWeight.save();
    res.status(201).json(savedWeight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing weight entry for a specific user
weightRouter.put('/weights/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { weight } = req.body;

  try {
    const updatedWeight = await Weight.findOneAndUpdate(
      { _id: id, user_id: req.user._id }, // Ensure the user can only update their entries
      { weight },
      { new: true }
    );
    if (!updatedWeight) return res.status(404).json({ message: "Weight entry not found" });
    res.status(201).json(updatedWeight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = weightRouter;