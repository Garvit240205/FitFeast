import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';

function Image() {
  return (
    <div className="signin_img_container">
      <img className="signin_img" src="image_cgas_signIn.jpg" alt="Sign-in visual" />
    </div>
  );
}

export function SignInPage() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [success, setSuccess] = useState('');
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
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isValidEmail(username)) {
      setError('Please enter a valid email address!');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('https://fitfeast.onrender.com/api/signin', {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      setError('');
      setSuccess('Welcome!');

      // Fetch user details and handle redirection
      await fetchUserDetails(token);
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('Failed to sign in. Please check your credentials.');
      setSuccess('');
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="signin-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Image />

      <h2 className='started-container'>Welcome back!</h2>

      <form onSubmit={handleSignIn}>
        <div className='email-container' style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            className='email-box'
            type="email"
            id="email"
            name="email"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
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

        {error && (
          <div style={{ textAlign: 'center', color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

        <button
          className='signin-email-button'
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
      </form>

      <p className='dont-para'>Don't have an account?</p>

      <Link to="/SignUp" style={{ textDecoration: 'none' }}>
        <button
          className='signin-email-button'
          type="button"
          style={{
            padding: '10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign up
        </button>
      </Link>

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
  );
}
