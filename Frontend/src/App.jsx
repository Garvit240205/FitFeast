import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
// import Explore from './explore';
import { SignInPage } from './SignIn';
import { SignUpPage } from './SignUp';
import WelcomePage from './WelcomePage.jsx'
import FitnessProfile from './FitnessProfile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<SignInPage />}/>
        <Route path='WelcomePage' element={<WelcomePage />}/>
        <Route path='SignUp' element={<SignUpPage />}/>
        <Route path="Home" element={<Home />} />
        <Route path="Profile" element={<Profile />} />
        {/* <Route path='Explore' element={<Explore />}/> */}
        <Route path='FitnessProfile' element={<FitnessProfile />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
