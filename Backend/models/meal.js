const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mealType: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
    required: true 
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failure'],
    default: 'success'
  },
  nutrition: {
    recipesUsed: { type: Number, required: true },
    calories: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'calories' },
      standardDeviation: { type: Number, required: true }
    },
    fat: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'g' },
      standardDeviation: { type: Number, required: true }
    },
    protein: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'g' },
      standardDeviation: { type: Number, required: true }
    },
    carbs: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'g' },
      standardDeviation: { type: Number, required: true }
    }
  },
  category: {
    name: { type: String, required: true },
    probability: { type: Number, required: true }
  },
  recipes: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      imageType: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  requestBody: {
    mealType: { type: String, required: true }
  },
  image: {
    data: Buffer,
    contentType: String // Stores the MIME type (e.g., 'image/jpeg')
  }
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
