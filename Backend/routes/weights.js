const express = require('express');
const weightRouter = express.Router();
const Weight =require('../models/weights');

weightRouter.get('/weights', async (req, res) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  try {
      const weights = await Weight.find({ day: { $gte: lastWeek.toISOString().split('T')[0] } });
      res.json(weights);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

weightRouter.post('/weights', async (req, res) => {
  const { day, weight } = req.body;

  const newWeight = new Weight({ day, weight });
  try {
      const savedWeight = await newWeight.save();
      res.status(201).json(savedWeight);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Update existing weight
weightRouter.put('/weights/:id', async (req, res) => {
  const { id } = req.params;
  const { weight } = req.body;

  try {
      const updatedWeight = await Weight.findByIdAndUpdate(id, { weight }, { new: true });
      if (!updatedWeight) return res.status(404).json({ message: "Weight entry not found" });
      res.json(updatedWeight);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

module.exports = weightRouter;