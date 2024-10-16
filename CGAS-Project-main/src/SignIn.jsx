import React, { useState } from 'react';
import axios from 'axios';
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signin', {
        username,
        password,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div>
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

          {/* Error message section */}
          {error && (
            <div style={{ textAlign: 'center', color: 'red', marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <button className='signin-email-button' type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Sign in
          </button>
        </form>

        <p className='dont-para'>Don't have an account?</p>
        <button className='signin-email-button' type="button" style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign up
        </button>

        <p className='forgot-para'>Forgot password?</p>
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
