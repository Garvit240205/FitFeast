const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user'); // Import the user router
const mealRouter = require('./routes/meal'); // Import the meal router
const cors = require('cors');
const multer = require('multer'); // Import Multer
const path = require('path'); // Import path for file handling
const fs = require('fs'); // Import fs to manage file system operations

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use CORS to allow requests from your frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Define the upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Check if the uploads directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Specify the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use a timestamp to create unique filenames
    }
});

// Create a Multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
      // Only allow certain file types
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true); // Accept the file
      }
      cb('Error: File upload only supports the following filetypes - ' + filetypes); // Reject the file
  }
});

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://mhimeksh:himi2106@cluster0.m4gr0.mongodb.net/FitFeastDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use the user router
app.use('/api', userRouter);
app.use('/meals', mealRouter(upload)); // Pass the upload instance to the meal router

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
