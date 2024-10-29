// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: false },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Store user IDs of those who liked the post
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
