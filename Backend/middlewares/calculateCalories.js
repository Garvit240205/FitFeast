// middlewares/calculateCalories.js

const calculateDailyCalories = (user) => {
  const { weight, height, age, gender, goal, activityLevel = 'sedentary', additionalGoals = [] } = user; // Default to an empty array

  // Calculate BMR (Basal Metabolic Rate) using the Harris-Benedict equation
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    throw new Error('Gender should be "male" or "female"');
  }

  // Define activity level multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very active': 1.9
  };

  // Get the multiplier for the user's activity level
  const activityMultiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.2;

  // Calculate TDEE (Total Daily Energy Expenditure)
  let tdee = bmr * activityMultiplier;

  // Adjust calories based on the primary goal
  let dailyCalories;
  if (goal === 'maintain') {
    dailyCalories = tdee;
  } else if (goal === 'lose') {
    dailyCalories = tdee - 500; // Typically a deficit for weight loss
  } else if (goal === 'gain') {
    dailyCalories = tdee + 500; // Typically a surplus for weight gain
  } else {
    throw new Error('Invalid goal. Must be "maintain", "gain", or "lose"');
  }

  // Additional adjustments based on `additionalGoals`
  if (Array.isArray(additionalGoals)) {
    if (additionalGoals.includes('Gain Muscle')) {
      dailyCalories += 250; // Adding calories for muscle gain
    }
    if (additionalGoals.includes('Manage Stress')) {
      dailyCalories += 50; // Example adjustment
    }
    if (additionalGoals.includes('Increase Step Count')) {
      dailyCalories += 300; // Example adjustment
    }
    // Modify Diet and Manage Sleep do not change calorie intake directly.
  }

  // Calculate macronutrient requirements based on the goal
  let ratios;
  if (goal === 'maintain') {
    ratios = { carbs: 0.50, protein: 0.20, fat: 0.30 };
  } else if (goal === 'lose') {
    ratios = { carbs: 0.40, protein: 0.30, fat: 0.30 };
  } else if (goal === 'gain') {
    ratios = { carbs: 0.40, protein: 0.30, fat: 0.30 };
  } else {
    throw new Error('Invalid goal. Must be "maintain", "gain", or "lose"');
  }

  // Increase protein ratio if 'Gain Muscle' is an additional goal
  if (additionalGoals.includes('Gain Muscle')) {
    ratios.protein = 0.40; // Increase protein to 40%
    ratios.carbs = 0.40;    // Adjust carbs accordingly
    ratios.fat = 0.20;      // Adjust fat accordingly
  }

  const dailyCarbs = (dailyCalories * ratios.carbs) / 4; // Carbs: 4 kcal/gram
  const dailyProtein = (dailyCalories * ratios.protein) / 4; // Protein: 4 kcal/gram
  const dailyFat = (dailyCalories * ratios.fat) / 9; // Fat: 9 kcal/gram

  return {
    calories: Math.round(dailyCalories),
    carbs: Math.round(dailyCarbs),
    protein: Math.round(dailyProtein),
    fat: Math.round(dailyFat)
  };
};

// Middleware function
const calculateCaloriesMiddleware = (req, res, next) => {
  try {
    // Calculate the daily calorie and macronutrient requirements for the user
    const { calories, carbs, protein, fat } = calculateDailyCalories(req.user);
    req.user.dailyCalorieRequirement = {
      calories,
      carbs,
      protein,
      fat
    };
    next();
  } catch (error) {
    console.error('Error calculating daily calorie requirement:', error);
    res.status(500).json({ message: 'Error calculating daily calorie requirement' });
  }
};

module.exports = calculateCaloriesMiddleware;
