const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  weight: { type: Number, required: true }
});

const Weight = mongoose.model('Weight', weightSchema);
module.exports = Weight;