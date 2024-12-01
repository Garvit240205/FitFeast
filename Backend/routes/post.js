const express = require('express');
const Post = require('../models/post');
const authenticateToken = require('../middlewares/authMiddleware');

const postRouter = (upload) => {
    const router = express.Router();

    // Create a new post
    router.post('/add', upload.single('image'), authenticateToken, async (req, res) => {
        const { description } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: 'User ID is required', user: req.user });
        }

        const newPost = new Post({
            user_id: req.user._id,
            description,
            image: req.file
                ? {
                      data: req.file.buffer,
                      contentType: req.file.mimetype
                  }
                : {},
            likes: 0,
            likedBy: []
        });

        newPost
            .save()
            .then(post => res.status(201).json(post))
            .catch(err => res.status(500).json({ message: 'Error creating post', error: err }));
    });

    // Get all posts
    router.get('/get', async (req, res) => {
        Post.find()
            .populate('user_id', 'firstname user_profile_pic') // Populate user details
            .then(posts => res.status(200).json(posts))
            .catch(err => res.status(500).json({ message: 'Error fetching posts', error: err }));
    });

    // Get posts by a specific user
    router.get('/user/:userId', authenticateToken, (req, res) => {
        const { userId } = req.params;

        Post.find({ user_id: userId })
            .populate('user_id', 'firstname user_profile_pic')
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
            .populate('user_id', 'firstname user_profile_pic')
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
                if (post.user_id.toString() !== req.user._id.toString()) {
                    return res.status(403).json({ message: 'Unauthorized to delete this post' });
                }
                return post.remove();
            })
            .then(() => res.status(200).json({ message: 'Post deleted successfully' }))
            .catch(err => res.status(500).json({ message: 'Error deleting post', error: err }));
    });

    // Like a post
    router.post('/:id/like', authenticateToken, (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;

        Post.findById(id)
            .then(post => {
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                if (post.likedBy.includes(userId.toString())) {
                    return res.status(400).json({ message: 'You already liked this post' });
                }

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
        const userId = req.user._id;

        Post.findById(id)
            .then(post => {
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                if (!post.likedBy.includes(userId.toString())) {
                    return res.status(400).json({ message: 'You have not liked this post yet' });
                }

                post.likedBy = post.likedBy.filter(user => user.toString() !== userId.toString());
                post.likes -= 1;

                return post.save();
            })
            .then(updatedPost => res.status(200).json(updatedPost))
            .catch(err => res.status(500).json({ message: 'Error unliking post', error: err }));
    });

    // Get posts liked by the authenticated user
    router.get('/liked', authenticateToken, (req, res) => {
        const userId = req.user._id;

        Post.find({ likedBy: userId })
            .populate('user_id', 'firstname user_profile_pic')
            .then(posts => {
                if (posts.length === 0) {
                    return res.status(404).json({ message: 'No liked posts found' });
                }
                res.status(200).json(posts);
            })
            .catch(err => res.status(500).json({ message: 'Error fetching liked posts', error: err }));
    });

    return router;
};

module.exports = postRouter;
