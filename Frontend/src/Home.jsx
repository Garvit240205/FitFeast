import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Home.css"; // You may want to create a new CSS file for the Home page styles
import {jwtDecode} from 'jwt-decode';

const Home = () => {
  const [liked, setLiked] = useState(false); // State to toggle like

  const [posts, setPosts] = useState([
  ]);

  const handleAddPost = () => setShowPostModal(true); // NEW: Open post modal
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ image: null, description: "" });

  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setNewPost({ ...newPost, image: files[0] }); // Save the file for processing
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };
  
  

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken._id; // Change this based on how your token is structured
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Or handle the error as needed
    }
  };
  // Fetch all posts from the backend
  const fetchAllPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get("https://fitfeast.onrender.com/posts/get", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response)
      setPosts(response.data);
      console.log(posts)
      // Set likedPosts based on the fetched posts
      const userId = getUserIdFromToken(token); // Assume you have a function to get the user ID from the token
      const initialLikedPosts = response.data.reduce((acc, post) => {
        acc[post._id] = post.likedBy.includes(userId);
        return acc;
      }, {});
      setLikedPosts(initialLikedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts(); // Load posts on component mount
  }, []);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

const handleSavePost = async () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append('description', newPost.description);
  formData.append('image', newPost.image); // Ensure this matches the field name expected by multer
  try {
  const response = await fetch('https://fitfeast.onrender.com/posts/add', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}` // Do NOT set 'Content-Type' explicitly
    },
    body: formData // Pass FormData as the request body
});


    console.log(response);

    if (response.ok) {
      console.log('Post added successfully');
      setNewPost({ image: null, description: "" }); // Reset input fields
      await fetchAllPosts(); // Refresh posts after saving
    } else {
      // Handle errors from the server
      const errorData = await response.json();
      console.error('Error adding post:', errorData);
    }
    setShowPostModal(false);
  } catch (error) {
    console.error("Error adding post:", error);
  }
};


const [likedPosts, setLikedPosts] = useState({});
// Handle like/unlike functionality
const token=localStorage.getItem('token');
const toggleLike = async (postId) => {
  const isLiked = likedPosts[postId];
  const endpoint = isLiked ? 'unlike' : 'like';
  const method = isLiked ? 'DELETE' : 'POST';

  try {
    const response = await fetch(`https://fitfeast.onrender.com/posts/${postId}/${endpoint}`, {
      method: method,
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to toggle like: ${response.statusText}`);
    }

    const updatedPost = await response.json();

    // Update the post's likes count in the state
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: updatedPost.likes } : post
      )
    );

    const updatedLikedPosts = {
      ...likedPosts,
      [postId]: !isLiked,
    };

    setLikedPosts(updatedLikedPosts);
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

  // const handleSavePost = () => {
  //   const newPostEntry = {
  //     profilePic: "https://via.placeholder.com/100", // Default profile pic
  //     name: "Garvit Kochar", // User's name
  //     date: new Date().toLocaleDateString(), // Current date
  //     description: newPost.description,
  //     image: newPost.image,
  //   };
  //   setPosts([...posts, newPostEntry]); // Add new post to posts array
  //   setNewPost({ image: null, description: "" }); // Reset input fields
  //   setShowPostModal(false); // Close modal
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [sun, setSun] = useState(localStorage.getItem('theme') === 'dark');
  const toggleSun = () => {
    const newTheme = !sun;
    setSun(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // Store the preference
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setSun(true);
    } else {
      setSun(false);
    }
  }, []);
  
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div className={`design-root ${sun ? 'dark-mode' : ''}`}>
      {/* Bootstrap Navbar */}
      <nav className={`navbar navbar-expand-lg navbar-${sun ? 'dark' : 'light'} home-navbar`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/Home">
            {localStorage.getItem('username')}
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
            <li className="navbar-brand">
            
            <span onClick={toggleSun}>{sun ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-brightness-high" viewBox="0 0 16 16" style={{height:'30px',width:'30px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'  }}>
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg>
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-moon-fill" viewBox="0 0 16 16" style={{height:'25px',width:'25px',marginTop:'27px',marginRight:'10px',cursor:'pointer',alignItems:'center',justifyContent:'center'  }}>
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
              </svg>
            )}</span>
            
            </li>
              <li className="nav-item">
                <a className="nav-link active" href="/Home">
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
                   User Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/FitnessProfile">
                  Fitness Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* All Posts Section */}
      {/* <div className="home-all-posts">
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
            <img className="home-post-img" src={post.image} alt="Post" /> */}

            {/* Like and Share Icons */}
            {/* <div className="home-icon-row">
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
          
        ))} */}

        {/* {posts.map((post) => (
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
            <img className="home-post-img" src={post.image} alt="Post" /> */}

            {/* Like and Share Icons */}
            {/* <div className="home-icon-row">
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
      </div> */}
      {/* Display Posts */}
      <div className="home-all-posts">
          {posts.map((post, index) => (
              <div className="post" key={index}>
                <div className="profile-date-container">
                  <img className="prof-pic" src={'Thor.jpg'} alt="Profile" />
                  <strong className="profile-name">{post.user_id.firstname}</strong>
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
                  <p className="date">{new Date(post.createdAt).toISOString().split("T")[0]}</p>
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
              <span onClick={() => toggleLike(post._id)} style={{ cursor: "pointer",marginRight:'0px' }}>
                {likedPosts[post._id] ? (
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
              <span style={{marginLeft:'0px',fontFamily:'Nunito',fontWeight:'bold'}}>{post.likes} likes</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                  <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
                </svg>
            </div>
                </div>
          ))}

        </div>

      {/* Floating Action Button to Add Post */}
      <button className="home-add-post-btn" onClick={handleAddPost}>
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
    </div>
  );
};

export default Home;
