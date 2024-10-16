import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';

function Image() {
  return (
    <div className="signup_img_container">
      <img className="signup_img" src="image_cgas_signUp.jpg" alt="Sign-up visual" />
    </div>
  );
}

export function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setSuccess(''); // Clear success message if an error occurs
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        username,
        password,
      });
      console.log(response.data);
      setSuccess('User registered successfully!');
      setError(''); // Clear error message if registration is successful
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('Failed to sign up. Please try again.');
      setSuccess(''); // Clear success message if an error occurs
    }
  };

  return (
    <div>
      <div className="signup-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Image />

        <h2 className='started-container'>Let's get started</h2>

        <form onSubmit={handleSignUp}>
          <div className='username-container' style={{ marginBottom: '10px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              className='username-box'
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div className='password-container' style={{ marginBottom: '10px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              className='password-box'
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div className='confirm-container' style={{ marginBottom: '10px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
            <input
              className='confirm-box'
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Error and success messages */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

          <button className='signup-email-button' type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Sign up with email
          </button>

          <p className='or'>or</p>

          <button className='signup-google-button' type="button" style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            <div className='google-image-text-container'>
              <img src="google.png" className='google-image' alt="Google" />
              <p className='signup-google-text'>Sign up with Google</p>
            </div>
          </button>
        </form>

        <p className='already-para'>Already have an account?</p>
        <p className='follow-para'>Follow us on</p>

        <div className='icon-container'>
          <a href="https://x.com/GarvitKochar1" target="_blank" rel="noopener noreferrer">
            <img className='twitter-icon' src="twitter.png" alt="Twitter" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img className='insta-icon' src="instagram.png" alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
  );
}
