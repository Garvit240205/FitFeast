// middlewares/foodRecognition.js
const foodRecognitionMiddleware = async (req, res, next) => {
    try {
      // Change req.files to req.file since you're using upload.single()
      const { path: imagePath } = req.file; // Access the uploaded image path
  
      // Here you would add your logic to call the food recognition API with the imagePath
      // For example:
      const foodInfo = await callFoodRecognitionAPI(imagePath);
  
      // Attach the food info to the request object if you need it later
      req.foodInfo = foodInfo;
  
      next(); // Call the next middleware or route handler
    } catch (error) {
      console.error('Error in food recognition middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = foodRecognitionMiddleware;
  

