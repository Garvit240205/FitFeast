const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  day: { type: String, required: true },
  weight: { type: Number, required: true }
});

const Weight = mongoose.model('Weight', weightSchema);
module.exports = Weight;