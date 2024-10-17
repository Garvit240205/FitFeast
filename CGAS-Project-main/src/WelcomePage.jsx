import React, { useState } from 'react';
import './WelcomePage.css'; // Import the CSS file

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0); // Track the current step
  const [additionalContent, setAdditionalContent] = useState(null); // State for additional JSX content

  const handleContinue = () => {
    if (step === 0) {
      setAdditionalContent(
        <div className="container">
        <h1 className="header">Welcome</h1>
        <p className="bold-text">What can we call you?</p>
        <p className="normal-text">We'd like to know you.</p>
        {step === 0 && (
            <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            />
        )}
        {additionalContent} {/* Display additional content */}
        <button onClick={handleContinue} className="button">
            Continue
        </button>
        </div>
        );
    } else if (step === 1) {
      setAdditionalContent(
        <div>
          <p style={{ fontWeight: 'bold' }}>We're excited to learn more about you.</p>
          <p style={{ color: 'blue' }}>What are your interests?</p>
        </div>
      );
    } else if (step === 2) {
      setAdditionalContent(
        <div>
          <p style={{ fontWeight: 'bold' }}>Feel free to share your hobbies with us.</p>
          <p style={{ fontStyle: 'italic' }}>Any favorite activities?</p>
        </div>
      );
    } else if (step === 3) {
      setAdditionalContent(
        <div>
          <p style={{ fontWeight: 'bold' }}>Almost there!</p>
          <p>Just a few more details.</p>
        </div>
      );
    }

    if (step < 4) { // Assuming 5 steps (0 to 4)
      setStep(prevStep => prevStep + 1); // Move to the next step
    }
  };

  return (
    <div className="container">
      <h1 className="header">Welcome</h1>
      <p className="bold-text">What can we call you?</p>
      <p className="normal-text">We'd like to know you.</p>
      <div className="progress-container">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`step-bar ${index <= step ? 'filled' : ''}`}
          />
        ))}
      </div>
      {step === 0 && (
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      )}
      {additionalContent} {/* Display additional content */}
      <button onClick={handleContinue} className="button">
        Continue
      </button>
    </div>
  );
};

export default WelcomePage;
