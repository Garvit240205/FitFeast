const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware'); // Authentication middleware
const foodRecognitionMiddleware = require('../middlewares/foodRecognition'); // Food recognition middleware
const Meal = require('../models/meal'); // Meal model

// Function to create the meal router with the upload middleware instance
const createMealRouter = (upload) => {
    const mealRouter = express.Router();

    /**
     * POST: Add a new meal
     * Endpoint: /add
     */
    mealRouter.post(
        '/add',
        upload.single('image'),
        foodRecognitionMiddleware,
        authenticateToken,
        async (req, res) => {
            try {
                console.log('Request Body:', req.body);
                console.log('Uploaded File:', req.file);
                console.log('Food Info:', req.foodInfo);

                const { mealType } = req.body;

                // Validate inputs
                if (!mealType || !req.user) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }

                // Construct meal data
                const meal = new Meal({
                    user: req.user._id,
                    mealType,
                    status: req.foodInfo ? 'success' : 'failure',
                    nutrition: {
                        recipesUsed: req.foodInfo?.recipesUsed || 0,
                        calories: {
                            value: req.foodInfo?.nutrition?.calories?.value || Number(req.body.calories || 0),
                            unit: req.foodInfo?.nutrition?.calories?.unit || 'calories',
                            standardDeviation: req.foodInfo?.nutrition?.calories?.standardDeviation || 0
                        },
                        fat: {
                            value: req.foodInfo?.nutrition?.fat?.value || 0,
                            unit: 'g',
                            standardDeviation: req.foodInfo?.nutrition?.fat?.standardDeviation || 0
                        },
                        protein: {
                            value: req.foodInfo?.nutrition?.protein?.value || 0,
                            unit: 'g',
                            standardDeviation: req.foodInfo?.nutrition?.protein?.standardDeviation || 0
                        },
                        carbs: {
                            value: req.foodInfo?.nutrition?.carbs?.value || 0,
                            unit: 'g',
                            standardDeviation: req.foodInfo?.nutrition?.carbs?.standardDeviation || 0
                        }
                    },
                    category: {
                        name: req.foodInfo?.category?.name || 'Unknown',
                        probability: req.foodInfo?.category?.probability || 0
                    },
                    recipes: req.foodInfo?.recipes
                        ? req.foodInfo.recipes.map((recipe) => ({
                              id: recipe.id,
                              title: recipe.title,
                              imageType: recipe.imageType,
                              url: recipe.url
                          }))
                        : [],
                    requestBody: {
                        mealType: req.body.mealType,
                        calories: req.body.calories
                    },
                    image: req.file
                        ? {
                              data: req.file.buffer, // Store the image data as a buffer
                              contentType: req.file.mimetype // Store the MIME type of the file
                          }
                        : {}
                });

                await meal.save();

                res.status(201).json({ message: 'Meal added successfully', meal });
            } catch (error) {
                console.error('Error adding meal:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        }
    );

    /**
     * PUT: Update an existing meal
     * Endpoint: /update/:id
     */
    mealRouter.put('/update/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { mealType, nutrition, category, recipes, requestBody } = req.body;

        try {
            const meal = await Meal.findOne({ _id: id, user: req.user._id });
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }

            // Update fields
            meal.mealType = mealType || meal.mealType;
            meal.nutrition = nutrition || meal.nutrition;
            meal.category = category || meal.category;
            meal.recipes = recipes || meal.recipes;
            meal.requestBody = requestBody || meal.requestBody;

            if (req.file) {
                meal.image = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                };
            }

            await meal.save();

            res.status(200).json({ message: 'Meal updated successfully', meal });
        } catch (error) {
            console.error('Error updating meal:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });

// GET: Preview all meals for the authenticated user on a specific date
mealRouter.get('/preview', authenticateToken, async (req, res) => {
    try {
        const { date } = req.query;
        console.log(date)

        // Validate the date parameter
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        // Parse the input date to ensure it's in the correct format (e.g., YYYY-MM-DD)
        const selectedDate = new Date(date);

        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Find meals for the user on the specified date
        // This assumes that your Meal model has a field createdAt that records the creation date of the meal
        const meals = await Meal.find({
            user: req.user._id,
            createdAt: {
                $gte: new Date(selectedDate.setHours(0, 0, 0, 0)), // Start of the day
                $lt: new Date(selectedDate.setHours(23, 59, 59, 999)) // End of the day
            }
        });

        res.json({ message: 'User meals preview for the selected date', meals });
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


    return mealRouter;
};






module.exports = createMealRouter;
