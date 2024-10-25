// routes/meal.js
const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware'); // Authentication middleware
const Meal = require('../models/meal'); // Import the Meal model
const foodRecognitionMiddleware = require('../middlewares/foodRecognition'); // Food recognition middleware

// Define a function to create the router with the upload instance
const createMealRouter = (upload) => {
    const mealRouter = express.Router(); // Move router creation inside the function

    // POST: Add a new meal
    mealRouter.post('/add', upload.single('image'), foodRecognitionMiddleware, authenticateToken, async (req, res) => {
        console.log('Request Body:', req.body); // Log request body for debugging
        console.log('Uploaded File:', req.file); // Log uploaded file for debugging

        const { mealType, totalCalories } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Ensure req.file exists

        try {
            const meal = new Meal({
                user: req.user._id,  // Logged-in user’s ID
                mealType,
                items: req.foodInfo ? req.foodInfo.items : [], // Use the food info from the middleware if it exists
                totalCalories,
                imageUrl, // Save the image URL in the meal entry if necessary
            });

            await meal.save();

            res.status(201).json({ message: 'Meal added successfully', meal });
        } catch (error) {
            console.error('Error adding meal:', error); // Log the error
            res.status(500).json({ message: 'Internal server error', error: error.message }); // Include error message in response for debugging
        }
    });

    // PUT: Update an existing meal for the authenticated user
    mealRouter.put('/update/:id', authenticateToken, async (req, res) => {
        const { id } = req.params; // Meal ID
        const { mealType, items, totalCalories } = req.body;

        try {
            const meal = await Meal.findOne({ _id: id, user: req.user._id });
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }

            // Update fields
            meal.mealType = mealType || meal.mealType; // Preserve existing value if not provided
            meal.items = items || meal.items; // Preserve existing value if not provided
            meal.totalCalories = totalCalories || meal.totalCalories; // Preserve existing value if not provided

            await meal.save();

            res.json({ message: 'Meal updated successfully', meal });
        } catch (error) {
            console.error('Error updating meal:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // DELETE: Remove a meal for the authenticated user
    mealRouter.delete('/remove/:id', authenticateToken, async (req, res) => {
        const { id } = req.params; // Meal ID

        try {
            const meal = await Meal.findOneAndDelete({ _id: id, user: req.user._id });
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }

            res.json({ message: 'Meal deleted successfully' });
        } catch (error) {
            console.error('Error deleting meal:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // GET: Preview all meals for the authenticated user
    mealRouter.get('/preview', authenticateToken, async (req, res) => {
        try {
            const meals = await Meal.find({ user: req.user._id });

            res.json({ message: 'User meals preview', meals });
        } catch (error) {
            console.error('Error fetching meals:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return mealRouter; // Return the configured router
};

module.exports = createMealRouter; // Export the createMealRouter function
