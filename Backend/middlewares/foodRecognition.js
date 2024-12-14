const axios = require('axios');
const FormData = require('form-data');

const foodRecognitionMiddleware = async (req, res, next) => {
  try {
    // Check if there is a file and it's a valid buffer
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded or invalid file format' });
    }

    // List of API keys for failover
    const apiKeys = [
      'aad64994367040b09ac8baddaf5299d7',
      '286e3b72e02b415a9e8cefed2e92be04',
      'd68479f793444bb9a21da6177ec0c430'
    ];

    let foodInfo;
    let success = false;

    // Step 1: Create a FormData instance
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: 'image.jpg' }); // Add the image buffer

    // Step 2: Iterate over API keys until one succeeds
    for (const apiKey of apiKeys) {
      try {
        const response = await axios.post(
          `https://api.spoonacular.com/food/images/analyze?apiKey=${apiKey}`,
          form,
          {
            headers: {
              ...form.getHeaders(), // Get the headers from the FormData instance
            },
          }
        );

        foodInfo = response.data;

        // Check if the response is valid
        if (foodInfo && foodInfo.status === 'success') {
          success = true;
          break; // Exit the loop on success
        }
      } catch (apiError) {
        console.error(`API key ${apiKey} failed:`, apiError.message || apiError);
      }
    }

    if (!success) {
      return res.status(500).json({ message: 'All API keys failed to fetch food recognition data' });
    }

    // Step 3: Extract relevant information from the response
    req.foodInfo = {
      nutrition: foodInfo.nutrition,
      category: foodInfo.category,
      recipes: foodInfo.recipes,
    };

    // Optional: Log the extracted information
    // console.log('Extracted Food Info:', req.foodInfo);

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in food recognition middleware:', error.message || error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = foodRecognitionMiddleware;
