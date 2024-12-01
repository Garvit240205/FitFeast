const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user'); // Import the user router
const mealRouter = require('./routes/meal'); // Import the meal router
const weightRouter = require('./routes/weights'); // Import the weight router
const postRouter = require('./routes/post'); // Import the post router
const cors = require('cors');
const multer = require('multer'); // Import Multer
const path = require('path'); // Import path for file handling

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use CORS to allow requests from your frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Multer setup for in-memory storage (buffer)
const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage for direct binary upload to MongoDB
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        // Only allow certain file types
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true); // Accept the file
        }
        cb(new Error('File upload only supports the following filetypes: jpeg, jpg, png, gif')); // Reject the file
    }
});

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://mhimeksh:himi2106@cluster0.m4gr0.mongodb.net/FitFeastDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mount routers with respective paths
app.use('/api', userRouter);
app.use('/weight', weightRouter);
app.use('/meals', mealRouter(upload)); // Pass the Multer upload instance to the meal router
app.use('/posts', postRouter(upload));

// Global error handling middleware for file upload errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ message: 'Multer error', error: err.message });
    } else if (err) {
        // General errors
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
