// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String },
  goal: { type: String },
  country: { type: String },
  zipcode: { type: String },
  activityLevel: { type: String },
  calorieRequirement: {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  welcomeDetails: { type: Boolean }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
