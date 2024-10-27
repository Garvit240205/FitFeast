const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const foodRecognitionMiddleware = async (req, res, next) => {
  try {
    const { path: imagePath } = req.file; // Access the uploaded image path

    // Step 1: Create a FormData instance
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath)); // Add the image file

    // Step 2: Call the Spoonacular API with the image file
    const apiKey = 'd68479f793444bb9a21da6177ec0c430'; // Hardcoded API key
    const response = await axios.post(
      `https://api.spoonacular.com/food/images/analyze?apiKey=${apiKey}`,
      form,
      {
        headers: {
          ...form.getHeaders(), // Get the headers from the FormData instance
        },
      }
    );

    const foodInfo = response.data;

    // Step 3: Check if the response is valid
    if (foodInfo.status !== 'success') {
      return res.status(400).json({ message: 'Invalid response from food recognition API' });
    }

    // Step 4: Extract relevant information from the response
    req.foodInfo = {
      nutrition: foodInfo.nutrition,
      category: foodInfo.category,
      recipes: foodInfo.recipes,
    };

    // Optional: Log the extracted information
    console.log('Extracted Food Info:', req.foodInfo);

    // Optional: Delete the uploaded file if it’s no longer needed
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in food recognition middleware:', error.message || error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = foodRecognitionMiddleware;
