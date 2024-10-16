import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Explore.css';

const Navbar = () => {
  const [sun, setSun] = useState(false);

  const toggleSun = () => setSun(!sun);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light home-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Garvit Kochar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            
            <span onClick={toggleSun}>{sun ? (
              <img src='sun.png'  style={{height:'30px',width:'30px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'}} ></img>
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon-fill" viewBox="0 0 16 16" style={{height:'30px',width:'30px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'  }}>
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
              </svg>
            )}</span>
            
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Explore">
                Explore
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Profile">
                Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const ProfileCard = ({ name, bio, image, coverImage }) => {
  return (
    <div className="user-profile-card-2">
      <div className="cover-image-2" style={{ backgroundImage: `url(${coverImage})` }}></div>
      <img src={image} alt={name} className="profile-image-2" />
      <h2 className="profile-name-2">{name}</h2>
      <p className="profile-bio-2">{bio}</p>
    </div>
  );
};

const ProfileGrid = ({ profiles }) => {
  return (
    <div>
      <Navbar />
      <div className="user-profile-grid-2">
        {profiles.map((profile, index) => (
          <ProfileCard 
            key={index} 
            name={profile.name} 
            bio={profile.bio} 
            image={profile.image} 
            coverImage={profile.coverImage}
          />
        ))}
      </div>
    </div>
  );
};

// Sample data for profiles
const sampleProfiles = [
  {
    name: 'John Doe',
    bio: 'Software Engineer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Graphic Designer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Graphic Designer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Graphic Designer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Thank you for your interest in the HPAIR 2025 Harvard Conference! This year, our Harvard Conference will take place from February 7 to 9, 2025. Please note that your application will not be saved if you do not submit this form. Applicants are required to submit their own original responses and should not use AI-generated answers. If you have any questions, please email help@hpair.org.',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Graphic Designer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
  {
    name: 'Jane Smith',
    bio: 'Graphic Designer',
    image: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/300x150',
  },
];

const Explore = () => {
  return <ProfileGrid profiles={sampleProfiles} />;
};

export default Explore;
