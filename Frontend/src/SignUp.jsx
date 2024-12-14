import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode } from "jwt-decode";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(username)) {
      setError('Please enter a valid email address!');
      setSuccess('');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('https://fitfeast.onrender.com/api/signup', {
        username,
        password,
      });
      console.log(response.data);
      setSuccess('User registered successfully!');
      setError('');
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('Failed to sign up. Please try again.');
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchUserDetails = async (token) => {
    try {
      await delay(1000);
      const response = await fetch('https://fitfeast.onrender.com/api/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token
        },
      });

      const data = await response.json();
      console.log(data)
      if (data.redirect === 'FitnessProfile') {
        navigate('/FitnessProfile');
      } else {
        navigate('/WelcomePage');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details.');
    }
  };
  const handleGoogleSignIn = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) {
        console.error("Token is missing.");
        setError("Token is missing. Please try again.");
        return;
    }
    const user = jwtDecode(token);
    console.log("Decoded user:", user);

    try {
        // Dynamically import jwt-decode
        const jwt_decode = (await import("jwt-decode")).default;
        const user = jwtDecode(token);

        const response = await axios.post('https://fitfeast.onrender.com/api/google-login', { token });
        console.log("Google Sign-In successful:", response.data);
        setSuccess('Logged in with Google!');
        setError('')
        // Fetch user details and handle redirection
        await fetchUserDetails(response.data.token);
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        console.error('Google sign-in failed:', error);
        setError('Google sign-in failed. Please try again.');
        setSuccess('');
    }
};

  
  return (
    <div>
      <GoogleOAuthProvider clientId="225589132267-2mbhelusrktjd8j7m8u3mkbj7fbtlvmt.apps.googleusercontent.com">
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

          <div className='password-container' style={{ marginBottom: '10px', position: 'relative' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              className='password-box'
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(25%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              )}
            </button>
          </div>

          <div className='confirm-container' style={{ marginBottom: '10px', position: 'relative' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
            <input
              className='confirm-box'
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(25%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              )}
            </button>
          </div>

          {/* Error and success messages */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

          <button className='signup-email-button' type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Sign up with email
          </button>

          <p className='or'>or</p>
          
          <div className='google-container'>
          <GoogleLogin className='nsm7Bb-HzV7m-LgbsSe-MJoBVe'
            onSuccess={handleGoogleSignIn}
            onError={() => setError('Google sign-in failed.')}
          />
          </div>
          
        </form>
        

        <a href='/'>
          <p className='already-para'>Already have an account?</p>
        </a>
        
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
      </GoogleOAuthProvider>
    </div>
  );
}
