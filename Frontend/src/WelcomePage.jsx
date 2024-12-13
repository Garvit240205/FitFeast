import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';
import axios from 'axios'; // Ensure axios is imported

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [showFormula, setShowFormula] = useState(false);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [calorieCount, setCalorieCount] = useState(2200); 
  const [error, setError] = useState('');

  const activityLevels = {
    sedentary: 'Sedentary (Little to no exercise, desk job)',
    light: 'Lightly Active (Light exercise 1-3 days a week)',
    moderate: 'Moderately Active (Moderate exercise 3-5 days a week)',
    active: 'Active (Intense exercise 6-7 days a week)',
    'very active': 'Very Active (Very intense exercise, physical job)',
  };
  const convertHeightToCM = (feet, inches) => {
    return Math.round(feet * 30.48 + inches * 2.54);
  };

  function filterWeightGoals(goals) {
    const weightGoals = ["Lose Weight", "Maintain Weight", "Gain Weight"];
    return goals.filter(goal => !weightGoals.includes(goal));
  }

  function determineWeightGoal(selectedOptions) {
    if (selectedOptions.includes("Lose Weight")) return "lose";
    if (selectedOptions.includes("Maintain Weight")) return "maintain";
    if (selectedOptions.includes("Gain Weight")) return "gain";
    return null;
  }

  const userDetails = {
    firstname: name,
    age,
    weight,
    height: convertHeightToCM(heightFeet, heightInches),
    gender,
    goal: determineWeightGoal(selectedOptions),
    country,
    zipcode: zipCode,
    additionalGoals: filterWeightGoals(selectedOptions),
    activityLevel: selectedActivityLevel || '',
  };

  const updateUserDetails = async (userDetails) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.put(
        'http://localhost:3000/api/update-details',
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User details updated:', response.data);
      setCalorieCount(response.data.dailyCalorieRequirement.calories);
      console.log(calorieCount)
      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error);
      if (error.response) console.error('Response error:', error.response.data.message);
      throw error;
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!name) return 'Please enter your name.';
        break;
      case 1:
        if (selectedOptions.length === 0) return 'Please select at least one goal.';
        break;
      case 3:
        if (!gender) return 'Please select your gender.';
        if (!age) return 'Please enter your age.';
        if (!country) return 'Please select your country.';
        if (!zipCode) return 'Please enter your ZIP code.';
        break;
      case 4:
        if (!heightFeet || !heightInches) return 'Please enter your height.';
        if (!weight) return 'Please enter your weight.';
        break;
      case 5:
        if (!selectedActivityLevel) return 'Please select an activity level.';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    const errorMessage = validateStep(); // Validate the current step
    if (errorMessage) {
      setError(errorMessage); // Display the error if validation fails
      return;
    }

    setError(''); // Clear any existing error

    if (step === 5) {
      try {
        await updateUserDetails(userDetails);
      } catch (error) {
        setError('Failed to update user details. Please try again.');
        console.error(error);
      }
    }

    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== option));
    } else if (selectedOptions.length < 3) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const toggleFormula = () => {
    setShowFormula(!showFormula);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h1 className="header">Welcome</h1>
            <p className="bold-text">What can we call you?</p>
            <p className="normal-text">We'd like to know you.</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
        );
      case 1:
        const options = ['Lose Weight', 'Maintain Weight', 'Gain Weight', 'Gain Muscle', 'Modify My Diet', 'Manage Stress', 'Increase Step Count', 'Manage Sleep'];
        
        const handleOptionClick = (option) => {
          const isFirstThreeOptions = ['Lose Weight', 'Maintain Weight', 'Gain Weight'].includes(option);
          
          if (selectedOptions.includes(option)) {
            // Deselect the option if already selected
            setSelectedOptions(selectedOptions.filter(opt => opt !== option));
          } else if (selectedOptions.length < 3) {
            // Allow selecting new options only if fewer than 3 are selected
            if (isFirstThreeOptions) {
              const filteredSelectedOptions = selectedOptions.filter(
                opt => !['Lose Weight', 'Maintain Weight', 'Gain Weight'].includes(opt)
              );
              setSelectedOptions([...filteredSelectedOptions, option]);
            } else {
              setSelectedOptions([...selectedOptions, option]);
            }
          }
        };
        
        return (
          <div>
            <h1 className="header">Goals</h1>
            <p className="bold-text">Hey {name}. Let's start with your goals!</p>
            <p className="normal-text" style={{ marginTop: '10px' }}>
              Select up to three that are most important to you
            </p>
            <div className="options-container" style={{ display: 'flex', marginTop: '20px' }}>
              {/* Left Column */}
              <div
                style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '43%', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginLeft: '10px'
                }}
              >
                {options.slice(0, 4).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''}`}
                    style={{ marginBottom: '10px' }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {/* Right Column */}
              <div
                style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '45%', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                {options.slice(4).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''}`}
                    style={{ marginBottom: '10px' }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h1 className="header" style={{ fontSize: '50px', fontFamily: 'Nunito' }}>Great! You have just taken a big step on your journey</h1>
            <p className="normal-text">Nutrition is critical to help you build muscle. Track your food to make sure you're getting enough protein and carbs for optimal metabolism.</p>
            <p className="normal-text">Now, let's talk about your goals.</p>
          </div>
        );
      case 3:
        return (
          <div style={{ justifyContent: 'center', alignContent: 'center' }}>
            <h1 className="header" style={{ fontSize: '30px', fontFamily: 'Nunito' }}>Tell us a little about yourself</h1>
            <div className="gender-selection">
              <button
                className={`gender-button ${gender === 'male' ? 'selected' : ''} male`}
                onClick={() => setGender('male')}
              >
                Male
              </button>
              <button
                className={`gender-button ${gender === 'female' ? 'selected' : ''} female`}
                onClick={() => setGender('female')}
              > 
                Female
              </button>
            </div>
            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito', marginBottom: '0px' }}>How old are you?</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                className="input"
                style={{ marginTop: '10px' }}
              />
              <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito', marginBottom: '0px' }}>Where do you live?</h1>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input"
                style={{ marginTop: '10px' }}
              >
                <option value="">Select your country</option>
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
              </select>
              <input
                type="text"
                placeholder="Enter your ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="input"
                style={{ marginTop: '10px' }}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 className="header" style={{ fontSize: '30px', fontFamily: 'Nunito', textAlign: 'center' }}>Just a few more questions</h1>

            {/* Height Input */}
            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito', marginBottom: '0px', textAlign: 'center' }}>How tall are you?</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', width: '800px' }}>
              <select value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} className="input" style={{ marginRight: '10px', textAlign: 'center' }}>
                <option value="">Select feet</option>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((ft) => (
                  <option key={ft} value={ft}>{ft} ft</option>
                ))}
              </select>

              <select value={heightInches} onChange={(e) => setHeightInches(e.target.value)} className="input" style={{ textAlign: 'center' }}>
                <option value="">Select inches</option>
                {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                  <option key={inch} value={inch}>{inch} in</option>
                ))}
              </select>
            </div>

            {/* Weight Input */}
            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito', marginBottom: '0px', marginTop: '20px', textAlign: 'center' }}>How much do you weigh?</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ display: 'flex', position: 'relative', width: '800px', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value, 10) || 0)}
                  className="input"
                  style={{ paddingRight: '35px', textAlign: 'center' }}
                />
                <span style={{ position: 'absolute', right: '385px', top: '50%', transform: 'translateY(-80%)', fontSize: '16px', color: '#888' }}>kg</span>
              </div>
            </div>

            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito', marginBottom: '0px', marginTop: '10px', textAlign: 'center' }}>It's ok to estimate. You can change this later in your profile.</h1>
          </div>
        );

      case 5:
        const options2 = [
          { label: 'Little to no exercise, desk job', value: 'sedentary' },
          { label: 'Light exercise 1-3 days a week', value: 'light' },
          { label: 'Moderate exercise 3-5 days a week', value: 'moderate' },
          { label: 'Intense exercise 6-7 days a week', value: 'active' },
          { label: 'Very intense exercise, physical job', value: 'very active' },
        ];

        const handleOptionClick2 = (value) => {
          setSelectedActivityLevel(value);
        };

        return (
          <div>
            <h1 className="header">Activity</h1>
            <p className="bold-text">Hey {name}. Let's talk about your daily activity!</p>
            <p className="normal-text" style={{ marginTop: '10px' }}>
              Select only one that suits you the most.
            </p>
            <div className="options-container2" style={{ display: 'flex', marginTop: '20px' }}>
              {/* Left Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px',
                }}
              >
                {options2.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick2(option.value)}
                    className={`option-button2 ${
                      selectedActivityLevel === option.value ? 'selected' : ''
                    }`}
                    style={{ marginBottom: '10px' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        case 6:return (
          <div>
            <h1 className="header" style={{ fontSize: '50px', fontFamily: 'Nunito' }}>Congratulations, {name}!</h1>
            <p className="normal-text">You're one step closer to your goal.</p>
            <p className="normal-text">Your daily net calorie goal is:</p>

            {/* Calorie Display */}
            <div className="box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
              <p style={{ fontSize: '40px', color: 'green' }}>{calorieCount}</p>
              <p style={{ marginLeft: '10px', fontSize: '40px' }}>calories</p>
            </div>

            {/* Toggle Formula */}
            <p className="toggle-formula" onClick={toggleFormula} style={{ cursor: 'pointer', color: 'green', marginTop: '30px', width: '820px', marginLeft: '20px' }}>
              {showFormula ? 'Hide formula' : 'How we calculate your calories'}
            </p>

            {/* Show Formula if toggled */}
            {showFormula && (
              <div className="formula" style={{ marginTop: '10px' }}>
                <p className="normal-text" style={{ fontSize: '16px' }}>The formula used to calculate your calories is:</p>
                <p className="normal-text" style={{ fontSize: '16px' }}>
                  <strong>BMR (Basal Metabolic Rate) =</strong> 10 * weight (kg) + 6.25 * height (cm) - 5 * age + 5 (for males) or - 161 (for females)
                </p>
                <p className="normal-text" style={{ fontSize: '16px' }}><strong>Net Calories =</strong> BMR + activity level adjustment</p>
              </div>
            )}
          </div>
        );
        case 7:
          return(
            <div>
              
            </div>
          )
      default:
        return null;
    }
  };

  useEffect(() => {
    if (step === 2) {
      document.body.style.background = 'linear-gradient(190deg, #ddb4f6, #8dd0fc)';
      document.body.style.backgroundSize = '200% 200%';
    } else {
      document.body.style.backgroundColor = '#fff'; // Default background
    }

    // Cleanup function to reset the body background when the component unmounts
    return () => {
      document.body.style.background = ''; // Reset to default
    };
  }, [step]);
  useEffect(() => {
    // Log the user details whenever step changes (i.e., when the user advances in the form)
    if (step >= 6) {
      console.log('Updated user details:', userDetails);
    }
  }, [step, name, age, weight, heightFeet, heightInches, gender, country, zipCode, selectedActivityLevel]);

  return (
    <div className="container">
      <div className="progress-container">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className={`step-bar ${index <= step ? 'filled' : ''}`} />
        ))}
      </div>
      {renderStepContent()}
      {error && <p className="error-message" style={{color:'red'}}>{error}</p>} {/* Display error */}
      {step < 6 ? (
        <button onClick={handleContinue} className="button">
          Continue
        </button>
      ) : (
        <Link to="/FitnessProfile">
    <button className="button">
      Continue
    </button>
  </Link>
      )}
    </div>
  );
};

export default WelcomePage;
