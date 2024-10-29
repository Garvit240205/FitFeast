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
  profile_pic: { type: String },      
  calorieRequirement: {
    calories: { type: Number },
    carbs: { type: Number },
    protein: { type: Number },
    fat: { type: Number }
  },
  welcomeDetails: { type: Boolean },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]  // Reference to user's posts
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
