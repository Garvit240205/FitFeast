import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showFormula, setShowFormula] = useState(false); // New state to toggle the formula
  const calorieCount = 2200; // Example calorie count

  const handleContinue = () => {
    if (step < 6) {
      setStep((prevStep) => prevStep + 1);
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
          return (
            <div>
              <h1 className="header">Goals</h1>
              <p className="bold-text">Hey {name}. Let's start with your goals!</p>
              <p className="normal-text" style={{ marginTop: '10px' }}>
                Select up to three that are most important to you
              </p>
              <div className="options-container" style={{ display: 'flex', marginTop: '20px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '43%',alignItems:'center',justifyContent:'center',marginLeft:'10px' }}>
                  {options.slice(0, 4).map((option, index) => (
                    <button
                      key={option} // Use the option text as key for better readability
                      onClick={() => handleOptionClick(option)}
                      className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''}`}
                      style={{ marginBottom: '10px' }} // Add some margin between buttons
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '45%',alignItems:'center',justifyContent:'center' }}>
                  {options.slice(4).map((option, index) => (
                    <button
                      key={option} // Use the option text as key for better readability
                      onClick={() => handleOptionClick(option)}
                      className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''}`}
                      style={{ marginBottom: '10px' }} // Add some margin between buttons
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
                onChange={(e) => setAge(e.target.value)}
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
              <select className="input" style={{ marginRight: '10px', textAlign: 'center' }}>
                <option value="">Select feet</option>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((ft) => (
                  <option key={ft} value={ft}>{ft} ft</option>
                ))}
              </select>

              <select className="input" style={{ textAlign: 'center' }}>
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
        return (
          <div>
            <h1 className="header" style={{ fontSize: '50px', fontFamily: 'Nunito' }}>Congratulations, {name}!</h1>
            <p className="normal-text">You're one step closer to your goal.</p>
            <p className="normal-text">Your daily net calorie goal is:</p>

            {/* Calorie Display */}
            <div className="box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
              <p style={{ fontSize:'40px', color:'green' }}>{calorieCount}</p>
              <p style={{ marginLeft: '10px',fontSize:'40px' }}>calories</p>
            </div>


            {/* Toggle Formula */}
            <p className="toggle-formula" onClick={toggleFormula} style={{ cursor: 'pointer', color: 'green', marginTop: '30px',width:'820px',marginLeft:'20px' }}>
              {showFormula ? 'Hide formula' : 'How we calculate your calories'}
            </p>

            {/* Show Formula if toggled */}
            {showFormula && (
              <div className="formula" style={{ marginTop: '10px' }}>
                <p className="normal-text" style={{fontSize:'16px'}}>The formula used to calculate your calories is:</p>
                <p className="normal-text" style={{fontSize:'16px'}}>
                  <strong>BMR (Basal Metabolic Rate) =</strong> 10 * weight (kg) + 6.25 * height (cm) - 5 * age + 5 (for males) or - 161 (for females)
                </p>
                <p className="normal-text" style={{fontSize:'16px'}}><strong>Net Calories =</strong> BMR + activity level adjustment</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Effect to update body background style based on step
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

  return (
    <div className="container">
      <div className="progress-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`step-bar ${index <= step ? 'filled' : ''}`} />
        ))}
      </div>
      {renderStepContent()}
      {step < 6 ? (
        <button onClick={handleContinue} className="button">
          Continue
        </button>
      ) : (
        <div className="completion-message" style={{ textAlign: 'center' }}>
          <h1>Thank you for completing all steps, {name}!</h1>
          <p>Your setup is complete. You can now start using the app.</p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
