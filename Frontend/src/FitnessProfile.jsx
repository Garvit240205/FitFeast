import React from "react";
import { useState,useEffect } from "react";
import "./FitnessProfile.css";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


const FitnessProfile = () => {
  const [dailyCalorieRequirement, setCalorieGoal] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(440);
  const progressPercentage = (caloriesConsumed / dailyCalorieRequirement) * 100;
  const [sun, setSun] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [newPost, setNewPost] = useState({
    image: null,
    calories: "",
    ingredients: "",
    mealType: "Breakfast",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await axios.get('http://localhost:3000/api/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log('Response:', response);
  
        const user = response.data.user;
        console.log(user)
        if (!user || typeof user.dailyCalorieRequirement === 'undefined') {
          console.error('User details or dailyCalorieRequirement is missing in the response:', response.data);
          return;
        }
  
        setCalorieGoal(user.dailyCalorieRequirement.calories || 0);
        setCaloriesConsumed(0);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);
  


  
  const generateRandomCalories = () => {
    const randomCalories = Math.floor(Math.random() * 1000) + 1; // Random calories between 1 and 1000
    setNewPost({ ...newPost, calories: randomCalories });
  };
  useEffect(() => {
    
    setPosts([
      { id: 1, img: "Thor.png", username: "JohnDoe", meal: "Breakfast", date: "2024-10-20", description: "Omelette, Toast, and Orange Juice" },
      { id: 2, img: "Thor.png", username: "JaneDoe", meal: "Lunch", date: "2024-10-20", description: "Chicken Salad with Avocado" },
      { id: 3, img: "Thor.png", username: "JohnDoe", meal: "Dinner", date: "2024-10-19", description: "Grilled Salmon with Veggies" },
    ]);
  }, []);

  const filteredPosts = posts.filter((post) => post.date === selectedDate);
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  useEffect(() => {
    // Start the animation when the component mounts
    setIsAnimated(true);
  }, []);
  const nutrients = [
    { label: "Proteins", value: 30, goal: 50 },
    { label: "Fibre", value: 30, goal: 60 },
    { label: "Carbs", value: 40, goal: 100 },
    { label: "Fats", value: 60, goal: 70 },
  ];
  const toggleSun = () => setSun(!sun);
  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewPost({ ...newPost, image: URL.createObjectURL(files[0]) }); // Set the image file
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  // Create new post entry
  // const newEntry = {
  //   id: posts.length + 1,
  //   img: newPost.image,
  //   username: "CurrentUser", // Replace with actual user
  //   meal: newPost.mealType,
  //   date: new Date().toISOString().split("T")[0],
  //   description: `Calories: ${newPost.calories}, Ingredients: ${newPost.ingredients}, Meal: ${newPost.mealType}`,
  // };

    // Create a new FormData object
    const formData = new FormData(event.target);
    
    try {
      const response = await fetch('http://localhost:3000/meals/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Send the form data as the request body
      });
  
      if (response.ok) {
        // Handle successful response
        // Update posts state with the newly added meal entry from the response
        // setPosts([...posts, { ...newEntry, id: response.data.meal._id }]); // Assuming the response contains the meal ID

        // // Clear new post inputs
        // setNewPost({
        //   image: null,
        //   calories: "",
        //   ingredients: "",
        //   mealType: "Breakfast",
        // });
        console.log('Meal added successfully');
        setShowModal(false); // Close the modal if needed
      } else {
        // Handle errors from the server
        const errorData = await response.json();
        console.error('Error adding meal:', errorData);
      }
    } catch (error) {
      console.error('Error in request:', error);
    }
  };
  

  const handleSavePost = () => {
    // Logic to save the post
    console.log('Saving post:', newPost);
    // Add your saving logic here
    setShowPostModal(false); // Close the modal after saving
  };


const handleAddPost = async (e) => {
  // e.preventDefault();

  // Create new post entry
  const newEntry = {
    id: posts.length + 1,
    img: newPost.image,
    username: "CurrentUser", // Replace with actual user
    meal: newPost.mealType,
    date: new Date().toISOString().split("T")[0],
    description: `Calories: ${newPost.calories}, Ingredients: ${newPost.ingredients}, Meal: ${newPost.mealType}`,
  };

  // Create FormData to send with Axios
  const formData = new FormData();
  formData.append('mealType', newPost.mealType);
  formData.append('image', newPost.image);
  formData.append('calories', newPost.calories);
  console.log(formData)
  try {
    const token = localStorage.getItem('token');
    // Send a POST request to your backend API
    const response = await axios.post('http://localhost:3000/meals/add', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Replace with actual JWT token
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Meal added:', response.data);
    
    // Update posts state with the newly added meal entry from the response
    setPosts([...posts, { ...newEntry, id: response.data.meal._id }]); // Assuming the response contains the meal ID

    // Clear new post inputs
    setNewPost({
      image: null,
      calories: "",
      ingredients: "",
      mealType: "Breakfast",
    });

    // Optionally close the modal if applicable
    setShowModal(false);
  } catch (error) {
    console.error('Error adding meal:', error);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setNewPost((prevPost) => ({ ...prevPost, image: reader.result }));
    };
  
    if (file) {
      reader.readAsDataURL(file); // Convert image file to data URL
    }
  };

  const calorieData = [
    {
      day:"Mon",
      caloriesConsumed:1800,
      caloriesBurned:1600
    },
    {
      day:"Tue",
      caloriesConsumed:2800,
      caloriesBurned:2600
    },
    {
      day:"Wed",
      caloriesConsumed:1000,
      caloriesBurned:1600
    },
    {
      day:"Thu",
      caloriesConsumed:4800,
      caloriesBurned:1600
    },
    {
      day:"Fri",
      caloriesConsumed:1200,
      caloriesBurned:900
    }
  ]

  const weightData = [
    {
      day:"Mon",
      weight:67
    },
    {
      day:"Tue",
      weight:69
    },
    {
      day:"Wed",
      weight:70
    },
    {
      day:"Thu",
      weight:68
    },
    {
      day:"Fri",
      weight:66
    }
  ]
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
    <div className="design-root">
      <div className="layout-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light home-navbar">
          <div className="container-fluid">
            <a className="navbar-brand" href="/Home">
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
                <li className="navbar-brand">
                  <span onClick={toggleSun}>
                    {sun ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-brightness-high" viewBox="0 0 16 16" style={{ height: '30px', width: '30px', marginTop: '27px', marginRight: '10px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
                        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-moon-fill" viewBox="0 0 16 16" style={{ height: '25px', width: '25px', marginTop: '27px', marginRight: '10px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
                        <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
                      </svg>
                    )}
                  </span>
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
                    Profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="content">
          <div className="stats">
            {[{ label: "Calories consumed", value: caloriesConsumed },
              { label: "Calorie Goal", value: dailyCalorieRequirement }
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="content2">
            <div className="circular-progress-container">
              <svg className="progress-circle" viewBox="0 0 36 36">
                <path
                  className="circle-background"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-progress"
                  strokeDasharray={isAnimated ? `${progressPercentage}, 100` : "0, 100"} // Trigger animation
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="circle-text">
                  {`${Math.round(progressPercentage)}%`}
                </text>
              </svg>
              <p className="progress-label">Calorie Goal</p>

              <div className="nutrient-stats">
                {nutrients.map((stat, index) => {
                  const nutrientProgress = (stat.value / stat.goal) * 100;
                  return (
                    <div key={index} className="stat-item">
                      <div className="small-circle">
                        <svg
                          viewBox="0 0 36 36"
                          className="progress-circle-small"
                        >
                          <path
                            className="small-circle-path"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="small-circle-progress"
                            strokeDasharray={isAnimated ? `${progressPercentage}, 100` : "0, 100"} // Trigger animation
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="small-circle-text">
                            {stat.value}
                          </text>
                        </svg>
                      </div>
                      <p className="stat-label">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Area Chart inside Curved Box */}
          {/* <div className="curved-box-container">
            <svg className="curved-box" viewBox="0 0 400 200">
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="4" result="offsetblur" />
                  <feFlood floodColor="rgba(54, 162, 235, 0.5)" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect
                x="10"
                y="10"
                width="370"
                height="100"
                rx="20"
                ry="20"
                fill="white"
                stroke="green"
                strokeWidth="1"
                filter="url(#shadow)"
              />
            </svg>

            <div className="chart-container">
              <h3>Calorie Trend This Week</h3>
              <Line data={calorieTrendData} options={lineOptions} />
            </div>
          </div> */}
          
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={calorieData}>
              <defs>
                <linearGradient id="colorBurned" x1={0} x2={0} y1={0} y2={1}>
                  <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                </linearGradient>

                <linearGradient id="colorConsumed" x1={0} x2={0} y1={0} y2={1}>
                  <stop offset="0%" stopColor="#FF6347" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="#FF6347" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip></Tooltip>
              <Legend />

              
              {/* <Area
                type="monotone"
                dataKey="caloriesBurned"
                stroke="#2451B7"
                fill="url(#colorBurned)"
                stackId={1}
              /> */}
              
              <Area
                type="monotone"
                dataKey="caloriesConsumed"
                stroke="#FF6347" // Tomato color for stroke
                fill="url(#colorConsumed)"
                stackId={2}
              />
            </AreaChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorBurned" x1={0} x2={0} y1={0} y2={1}>
                  <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                </linearGradient>

              </defs>
              
              <XAxis dataKey="weight" />
              <YAxis />
              <Tooltip></Tooltip>
              <Legend />

              
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#2451B7"
                fill="url(#colorBurned)"
                stackId={1}
              />
            </AreaChart>
            </ResponsiveContainer>


            {/* Form for adding a post */}

            {showModal && (
          <div className={`modal ${showModal ? 'show d-block' : 'fade'}`} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Meal</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
              <form
  onSubmit={handleSubmit}
  encType="multipart/form-data"
>
  <div className="mb-3">
    <label htmlFor="image" className="form-label">Upload Image</label>
    <input
      type="file"
      className="form-control"
      id="image"
      name="image"
      accept="image/*"
      required
    />
  </div>
  <div className="mb-3">
    <label htmlFor="calories" className="form-label">Calories</label>
    <input
      type="text"
      className="form-control"
      id="calories"
      name="calories"
      value={newPost.calories}
      onChange={handleInputChange}
      required
    />
    <button
      type="button"
      className="btn btn-secondary mt-2"
      onClick={generateRandomCalories}
    >
      AI Generated
    </button>
  </div>
  <div className="mb-3">
    <label htmlFor="mealType" className="form-label">Meal Type</label>
    <select
      className="form-control"
      id="mealType"
      name="mealType"
      required
    >
      <option value="breakfast">Breakfast</option>
      <option value="lunch">Lunch</option>
      <option value="dinner">Dinner</option>
      <option value="snack">Snack</option>
    </select>
  </div>
  <div className="modal-footer">
    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
    <button type="submit" className="btn btn-primary" >Save Meal</button>
  </div>
</form>


              </div>
              
            </div>
          </div>
        </div>
        )}

        {/* <div className="posts">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <h4>{post.username} - {post.meal} on {post.date}</h4>
              <p>{post.description}</p>
            </div>
          ))}
        </div> */}
          {/* Floating Action Button */}
          <button 
            className="snap-button" 
            onClick={() => setShowModal(true)}
          >
            <div className="snap-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-camera" viewBox="0 0 20 20" style={{marginTop:'5px'}}>
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
            </svg>
            <p>Snap</p>
            </div>
          </button>

          {/* <div className="quick-actions">
            <button className="log-weight">Log your weight</button>
            <h3 className="quick-actions-title">Quick actions</h3>
            <div className="streak-card">
              <div className="streak-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                  <path
                    d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,87.53,40,116.08,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85ZM128,216a72.08,72.08,0,0,1-72-72c0-22,8.09-44.79,24.06-67.84l26.37,25.58a8,8,0,0,0,13.09-3l22.27-61.07C164.21,58.08,200,97.91,200,144A72.08,72.08,0,0,1,128,216Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="streak-info">
                <p className="streak-days">7 days</p>
                <p className="streak-message">
                  Keep it up! You've logged your food every day this week.
                </p>
              </div>
            </div>
          </div> */}
          <div className="meals-section">
          <h1 style={{fontSize:'50px',textAlign:'center',marginTop:'20px'}}>Meals Consumed</h1>
          <div className="date-picker-container">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-picker"
            />
            <hr style={{marginTop:'20px'}}></hr>
          </div>

          <div className="meals-list">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="meal-post">
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
                    <p className="date">{selectedDate}</p>
                  </div>
                  <img className="posts-img" src={post.img} onClick={() => openModal(post.img)}
              style={{ cursor: 'pointer' }}></img>
                   {/* Modal for full-sized image */}
                  {isModalOpen && (
                    <div className="modal" onClick={closeModal}>
                      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img className="full-image" src={selectedImage} alt="Full Size" />
                      </div>
                    </div>
                  )}
                  <p className="post-desc">{post.description}</p>
                </div>
              ))
            ) : (
              <p>No data available for the selected date.</p>
            )}

           
      </div>
    </div>
        </div>
      </div>
    </div>
    
  );
};

export default FitnessProfile;
