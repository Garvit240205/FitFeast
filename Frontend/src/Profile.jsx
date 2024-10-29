import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const [liked, setLiked] = useState(false); // State to toggle like
  const [activeTab, setActiveTab] = useState("posts");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [sun, setSun] = useState(false);
  const [posts, setPosts] = useState([ // Initial posts
    {
      profilePic: "https://via.placeholder.com/100",
      name: "IIIT Delhi",
      date: "Jun 8, 2023",
      description:
        "Excited to host @sama, CEO of @OpenAI at IIIT-Delhi today!! #OpenAIatIIITDelhi #ChatGPT #AI",
      image: "Thor.jpg",
    },
  ]);

  const toggleSun = () => setSun(!sun);
  const toggleLike = () => setLiked(!liked); // Toggle between liked and unliked states
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };
  const [showPostModal, setShowPostModal] = useState(false);
  const handleAddPost = () => setShowPostModal(true); // NEW: Open post modal
  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewPost({ ...newPost, image: URL.createObjectURL(files[0]) });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };
  const [newPost, setNewPost] = useState({ image: null, description: "" });
  const handleSavePost = () => {
    const newPostEntry = {
      profilePic: "https://via.placeholder.com/100", // Default profile pic
      name: "Garvit Kochar", // User's name
      date: new Date().toLocaleDateString(), // Current date
      description: newPost.description,
      image: newPost.image,
    };
    setPosts([...posts, newPostEntry]); // Add new post to posts array
    setNewPost({ image: null, description: "" }); // Reset input fields
    setShowPostModal(false); // Close modal
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };
  return (
    <div>
      {/* Bootstrap Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className='navbar-brand' href='/Home'>{localStorage.getItem('username')}</a>
            
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
              <li className="navbar-brand">
              
              <span onClick={toggleSun}>{sun ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-brightness-high" viewBox="0 0 16 16" style={{height:'30px',width:'30px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'  }}>
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg>
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-moon-fill" viewBox="0 0 16 16" style={{height:'25px',width:'25px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'  }}>
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
              </svg>
            )}</span>
              
              </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Home">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Explore">
                    Explore
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="/Profile">
                    User Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/FitnessProfile">
                    Fitness Profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      

      {/* Main Profile Section */}
      <div className="profile-section">
        <div className="header">
          <img
            className="cover-image"
            src="https://via.placeholder.com/1200x300?text=Cover+Image"
            alt="Cover"
          />
        </div>

        <div className="profile-info">
          <img
            className="profile-pic"
            src="https://via.placeholder.com/100"
            alt="Profile"
          />
          <div className="name-edit">
            <h2>Garvit Kochar</h2>
            <button
              className="edit-button"
              onClick={() => setShowModal(true)} // Show modal on click
            >
              Edit Profile
            </button>
          </div>
          
          <div className="details">
            <p className="bio">IIITD</p>
            <div className="calen-join">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
              <p style={{ marginLeft: "10px" }}>Joined December 2017</p>
            </div>
          </div>

          {/* Sub-Navbar */}
          <div className="profile-navbar">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "posts" ? "active" : ""}`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "likes" ? "active" : ""}`}
                  onClick={() => setActiveTab("likes")}
                >
                  Likes
                </button>
              </li>
            </ul>
          </div>
        </div>

        {activeTab === "posts" ? (
          <div className="all-posts">
          {posts.map((post, index) => (
              <div className="post" key={index}>
                <div className="profile-date-container">
                  <img className="prof-pic" src={post.profilePic} alt="Profile" />
                  <strong className="profile-name">{post.name}</strong>
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
                  <p className="date">{post.date}</p>
                </div>
                <p className="post-para">{post.description}</p>
                {post.image && (
            <img
              className="post-img"
              src={post.image}
              alt="Post"
              onClick={() => openModal(post.image)}
              style={{ cursor: 'pointer' }} // Make it clear it's clickable
            />
          )}
          {/* Modal for full-sized image */}
          {isModalOpen && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeModal}>&times;</span>
                <img className="full-image" src={selectedImage} alt="Full Size" />
              </div>
            </div>
          )}


                {/* Like and Share Icons */}
            <div className="icon-row">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                  <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
                </svg>
            </div>
                </div>
          ))}

            
        {/* <div className="posts">
          <div className="post">
            <div className="profile-date-container">
              <img
                className="prof-pic"
                src="https://via.placeholder.com/100"
                alt="Profile"
              />
              <strong className="profile-name">IIIT Delhi</strong>
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
              <p className="date">Jun 8, 2023</p>
            </div>
            <p className="post-para">
              Excited to host <strong>@sama</strong>, CEO of{" "}
              <strong>@OpenAI</strong> at IIIT-Delhi today!! #OpenAIatIIITDelhi
              #ChatGPT #AI
            </p>
            <img className="post-img" src="Thor.jpg" alt="Post" />

            <div className="icon-row">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                  <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
                </svg>
            </div>
          </div>
        </div> */}
        </div>
        

        
        ) : (
          <div className="likes">
            <p>No likes yet.</p>
          </div>
        )}
      </div>

        {/* Floating Action Button */}
        <button 
          className="add-post-btn" 
          onClick={handleAddPost}
        >
          +
        </button>
      {/* Add Post Modal */}
      {showPostModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPostModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handlePostChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={newPost.description}
                      onChange={handlePostChange}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSavePost}>Save Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bootstrap Modal for Editing Profile */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={userDetails.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
