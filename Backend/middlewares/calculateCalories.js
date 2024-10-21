// middlewares/calculateCalories.js

const calculateDailyCalories = (user) => {
  const { weight, height, age, gender, goal, activityLevel = 'sedentary', additionalGoals } = user;

  // Calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
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
    dailyCalories = tdee - 500;
  } else if (goal === 'gain') {
    dailyCalories = tdee + 500;
  } else {
    throw new Error('Invalid goal. Must be "maintain", "lose", or "gain"');
  }

  // Additional adjustments based on `additionalGoals`
  if (additionalGoals) {
    if (additionalGoals.includes('Gain Muscle')) {
      dailyCalories += 250;
    }
    if (additionalGoals.includes('Manage Stress')) {
      dailyCalories += 50;
    }
    if (additionalGoals.includes('Increase Step Count')) {
      dailyCalories += 300;
    }
    if (additionalGoals.includes('Modify Diet')) {
      dailyCalories += 0; // No direct change; diet modification adjusts macros rather than calories
    }
    if (additionalGoals.includes('Manage Sleep')) {
      dailyCalories += 0; // No direct change; diet modification adjusts macros rather than calories
    }
  }

  return Math.round(dailyCalories);
};

  

// Middleware function
const calculateCaloriesMiddleware = (req, res, next) => {
  try {
    // Calculate the daily calorie requirement for the user
    const dailyCalories = calculateDailyCalories(req.user);
    req.user.dailyCalorieRequirement = dailyCalories;
    next();
  } catch (error) {
    console.error('Error calculating daily calorie requirement:', error);
    res.status(500).json({ message: 'Error calculating daily calorie requirement' });
  }
};

module.exports = calculateCaloriesMiddleware;

  