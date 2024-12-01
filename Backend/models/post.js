const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    image: { 
        data: Buffer, // Binary data for the image
        contentType: String // MIME type of the image (e.g., 'image/jpeg', 'image/png')
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Store user IDs of those who liked the post
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
