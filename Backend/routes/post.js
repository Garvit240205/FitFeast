// routes/posts.js
const express = require('express');
const Post = require('../models/post'); // Import your Post model
const authenticateToken = require('../middlewares/authMiddleware'); // Import your authentication middleware
const router = express.Router();

// Create a new post
router.post('/add', authenticateToken,async (req, res) => {
    console.log(req.body);
    const { description, image_url } = req.body;
    
    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: 'User ID is required', user: req.user });
    }

    const newPost = new Post({
        user_id: req.user._id, // Ensure this is set correctly
        description,
        image_url,
        likes: 0, // Initialize likes count
        likedBy: [] // Initialize likedBy array
    });

    newPost.save()
        .then(post => res.status(201).json(post))
        .catch(err => res.status(500).json({ message: 'Error creating post', error: err }));
});

// Get all posts
router.get('/get',async (req, res) => {
    Post.find()
        .populate('user_id', 'username user_profile_pic') // Populate user details if needed
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ message: 'Error fetching posts', error: err }));
});


// Get posts by a specific user
router.get('/user/:userId',authenticateToken, (req, res) => {
    const { userId } = req.params; // Extract the userId from params
    console.log('Received userId:', userId); // Debugging line

    Post.find({ user_id: userId }) // Find posts where the user_id matches the given userId
        .populate('user_id', 'username user_profile_pic') // Populate user details if needed
        .then(posts => {
            if (posts.length === 0) {
                return res.status(404).json({ message: 'No posts found for this user' });
            }
            res.status(200).json(posts);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching posts', error: err }));
});


// Get a specific post by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    Post.findById(id)
        .populate('user_id', 'username user_profile_pic') // Populate user details if needed
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json(post);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching post', error: err }));
});

// Update a post
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { description, image_url } = req.body;

    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            // Check if the post belongs to the user
            if (post.user_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized to update this post' });
            }

            post.description = description;
            post.image_url = image_url;

            return post.save();
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(500).json({ message: 'Error updating post', error: err }));
});

// Delete a post
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            // Check if the post belongs to the user
            if (post.user_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized to delete this post' });
            }
            return post.remove(); // Correctly remove the post
        })
        .then(() => res.status(200).json({ message: 'Post deleted successfully' }))
        .catch(err => res.status(500).json({ message: 'Error deleting post', error: err }));
});

// Like a post
router.post('/:id/like', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Get the user ID from the token

    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user already liked the post
            if (post.likedBy.includes(userId.toString())) {
                return res.status(400).json({ message: 'You already liked this post' });
            }

            // Add user ID to likedBy array and increment likes count
            post.likedBy.push(userId);
            post.likes += 1;

            return post.save();
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(500).json({ message: 'Error liking post', error: err }));
});

// Unlike a post
router.delete('/:id/unlike', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Get the user ID from the token

    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user has not liked the post yet
            if (!post.likedBy.includes(userId.toString())) {
                return res.status(400).json({ message: 'You have not liked this post yet' });
            }

            // Remove user ID from likedBy array and decrement likes count
            post.likedBy = post.likedBy.filter(user => user.toString() !== userId.toString());
            post.likes -= 1;

            return post.save();
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(500).json({ message: 'Error unliking post', error: err }));
});

module.exports = router;
