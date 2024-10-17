import React, { useState } from 'react';
import './WelcomePage.css'; // Import the CSS file

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0);

  const handleContinue = () => {
    if (progress < 100) {
      setProgress(prevProgress => prevProgress + 20); // Increase progress by 20% on each click
    }
  };

  return (
    <div className="container">
      <h1 className="header">Welcome</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <button onClick={handleContinue} className="button">
        Continue
      </button>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p>{name && `Hello, ${name}!`}</p>
    </div>
  );
};

export default WelcomePage;
