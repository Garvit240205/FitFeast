import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // You may want to create a new CSS file for the Home page styles

const Home = () => {
  const [liked, setLiked] = useState(false); // State to toggle like
  const [sun, setSun] = useState(false);

  const toggleSun = () => setSun(!sun);
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "IIIT Delhi",
      date: "Jun 8, 2023",
      content: `Excited to host <strong>@sama</strong>, CEO of <strong>@OpenAI</strong> at IIIT-Delhi today!! #OpenAIatIIITDelhi #ChatGPT #AI`,
      image: "Thor.jpg" // Replace with actual image URL or path
    },
    // Add more post objects here as needed
  ]);

  const toggleLike = () => setLiked(!liked); // Toggle between liked and unliked states
  const handleAddPost = () => {
    // Implement the logic to add a post here
    alert("Add Post clicked!");
  };

  return (
    <div>
      {/* Bootstrap Navbar */}
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
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Explore">
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

      {/* All Posts Section */}
      <div className="home-all-posts">
        {posts.map((post) => (
          <div key={post.id} className="home-post">
            <div className="home-profile-date-container">
              <img
                className="home-prof-pic"
                src="https://via.placeholder.com/100"
                alt="Profile"
              />
              <strong className="home-profile-name">{post.username}</strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-dot"
                viewBox="0 0 16 16"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              </svg>
              <p className="home-date">{post.date}</p>
            </div>
            <p className="home-post-para" dangerouslySetInnerHTML={{ __html: post.content }} />
            <img className="home-post-img" src={post.image} alt="Post" />

            {/* Like and Share Icons */}
            <div className="home-icon-row">
              <span onClick={toggleLike} style={{ cursor: "pointer" }}>
                {liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                  </svg>
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-share-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
              </svg>
            </div>
          </div>
          
        ))}

        {posts.map((post) => (
          <div key={post.id} className="home-post">
            <div className="home-profile-date-container">
              <img
                className="home-prof-pic"
                src="https://via.placeholder.com/100"
                alt="Profile"
              />
              <strong className="home-profile-name">{post.username}</strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-dot"
                viewBox="0 0 16 16"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              </svg>
              <p className="home-date">{post.date}</p>
            </div>
            <p className="home-post-para" dangerouslySetInnerHTML={{ __html: post.content }} />
            <img className="home-post-img" src={post.image} alt="Post" />

            {/* Like and Share Icons */}
            <div className="home-icon-row">
              <span onClick={toggleLike} style={{ cursor: "pointer" }}>
                {liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                  </svg>
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-share-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
              </svg>
            </div>
          </div>
          
        ))}
      </div>

      {/* Floating Action Button to Add Post */}
      <button className="home-add-post-btn" onClick={handleAddPost}>
        +
      </button>
    </div>
  );
};

export default Home;
