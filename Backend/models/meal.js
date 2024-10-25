// models/meal.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  items: [
    {
      foodName: { type: String, required: true },
      calories: { type: Number, required: true },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    }
  ],
  totalCalories: { type: Number },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
