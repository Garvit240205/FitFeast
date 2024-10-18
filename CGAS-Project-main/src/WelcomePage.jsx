import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleContinue = () => {
    if (step < 8) {
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
        const options = ['Lose Weight', 'Maintain Weight', 'Gain Weight', 'Gain Muscle', 'Modify My Diet', 'Manage Stress', 'Increase Step Count'];
        return (
          <div>
            <h1 className="header">Goals</h1>
            <p className="bold-text">Hey {name}. Let's start with your goals!</p>
            <p className="normal-text" style={{ marginTop: '10px' }}>
              Select up to three that are most important to you
            </p>
            <div className="options-container">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''}`}
                >
                  {option}
                </button>
              ))}
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
          <div>
            <p style={{ fontWeight: 'bold' }}>Almost there!</p>
            <p>Just a few more details.</p>
          </div>
        );
      case 4:
        return <h2>Thank you, {name}!</h2>;
      default:
        return null;
    }
  };

  // Effect to update body background style based on step
  useEffect(() => {
    if (step === 2) {
      document.body.style.background = 'linear-gradient(135deg, #fefae0, #dda15e, #bc6c25)';
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
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={`step-bar ${index <= step ? 'filled' : ''}`} />
        ))}
        <p className="sample-text">Step {step + 1} of 8</p>
      </div>
      {renderStepContent()}
      {step < 8 && (
        <button onClick={handleContinue} className="button">
          Continue
        </button>
      )}
    </div>
  );
};

export default WelcomePage;
