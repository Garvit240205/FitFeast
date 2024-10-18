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
          <div style={{justifyContent:'center',alignContent:'center'}}>
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
            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito',marginBottom:'0px' }}>How old are you?</h1>
            <div style={{display:'flex',justifyContent:'center',alignContent:'center',flexDirection:'column'}}>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input"
              style={{ marginTop: '10px' }}
            />
            <h1 className="header" style={{ fontSize: '20px', fontFamily: 'Nunito',marginBottom:'0px' }}>Where do you live?</h1>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input"
              style={{ marginTop: '10px' }}
            >
              <option value="">Select your country</option>
              {/* Add your country options here */}
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              {/* Add more countries as needed */}
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
        return <h2>Thank you, {name}!</h2>;
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
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={`step-bar ${index <= step ? 'filled' : ''}`} />
        ))}
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
