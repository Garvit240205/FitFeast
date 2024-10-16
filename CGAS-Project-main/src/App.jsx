import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Explore from './explore';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='Explore' element={<Explore />}/>
        <Route path='Explore ' element={<Explore />}/>
        <Route path="/" element={<Home />} />
        <Route path="Profile" element={<Profile />} />
        <Route path='Explore' element={<Explore />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
