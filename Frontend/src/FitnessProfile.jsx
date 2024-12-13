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
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [dailyProteinRequirement, setProteinGoal] = useState(0);
  const [dailyFatRequirement, setFatGoal] = useState(0);
  const [dailyCarbRequirement, setCarbGoal] = useState(0);

  const [ProteinConsumed, setProteinConsumed] = useState(0);
  const [FatConsumed, setFatConsumed] = useState(0);
  const [CarbConsumed, setCarbConsumed] = useState(0);

  const progressPercentage = (caloriesConsumed / dailyCalorieRequirement) * 100;
  const [sun, setSun] = useState(localStorage.getItem('theme') === 'dark');
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedDate, setSelectedDate] =useState(new Date().toISOString().split("T")[0]);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mealType, setMealType] = useState("Breakfast");
  const [ingredients, setIngredients] = useState("");
  const [newPost, setNewPost] = useState({
    image: null,
    calories: "",
    ingredients: "",
    mealType: "Breakfast",
  });
  // const [today, setToday] = useState(new Date().toDateString());
  // const [todaysData, setTodaysData] = useState({ calories: 0, proteins: 0, fats: 0, carbs: 0 });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetchTodaysMetrics();
  //     setTodaysData(data);
  //   };

  //   // Check if the date has changed since the last render
  //   const currentDate = new Date().toDateString();
  //   if (currentDate !== today) {
  //     setToday(currentDate);
  //     fetchData();
  //   }
  // }, [today, fetchTodaysMetrics]);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await axios.get('https://fitfeast.onrender.com/api/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log('Response:', response);
        localStorage.setItem('username',response.data.user.firstname)
        console.log(response.data.user.firstname)
        const user = response.data.user;
        console.log(user)
        setProteinGoal(response.data.user.dailyCalorieRequirement.protein)
        setFatGoal(response.data.user.dailyCalorieRequirement.fat)
        setCarbGoal(response.data.user.dailyCalorieRequirement.carbs)
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
  
  useEffect(() => {
    // Start the animation when the component mounts
    setIsAnimated(true);
  }, []);
  const nutrients = [
    { label: "Proteins", value: ProteinConsumed, goal: dailyProteinRequirement },
    { label: "Carbs", value: CarbConsumed, goal: dailyCarbRequirement },
    { label: "Fats", value: FatConsumed, goal: dailyFatRequirement },
  ];
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
  
  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewPost({ ...newPost, image: URL.createObjectURL(files[0]) });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };
  const [meals, setMeals] = useState([]);
  const [caloriesData,setCaloriesData]= useState([]);

  const fetchLast7DaysCalories = async () => {
    const last7DaysData = [];
    const token = localStorage.getItem('token');
  
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const selectedDate = date.toISOString().split("T")[0];
  
      try {
        const response = await axios.get(`https://fitfeast.onrender.com/meals/preview?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response);
        let dayCalories = 0, dayProtein = 0, dayFat = 0, dayCarbs = 0;
        response.data.meals.forEach(meal => {
          dayCalories += meal.nutrition.calories.value;
          dayProtein += meal.nutrition.protein.value;
          dayFat += meal.nutrition.fat.value;
          dayCarbs += meal.nutrition.carbs.value;
        });
  
        last7DaysData.push({
          day: selectedDate,
          caloriesConsumed: dayCalories,
          protein: dayProtein,
          fat: dayFat,
          carbs: dayCarbs
        });
  
      } catch (error) {
        console.error(`Error fetching meals for ${selectedDate}:`, error);
      }
    }
  
    setCaloriesData(last7DaysData); // Store data for graph
  };
  
  // Call this once to initially load data, and again when today's data is updated
  useEffect(() => {
    fetchLast7DaysCalories();
  }, []);
  
  const fetchMeals = async (selectedDate) => {
    try {
      const token = localStorage.getItem('token');
        console.log('Token:', token);
        // console.log(selectedDate)
        const response = await axios.get(`https://fitfeast.onrender.com/meals/preview?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response)
      setMeals(response.data.meals); 
      console.log(meals[0].image)
      let sum=0;
      let proteinsum=0;
      let fatsum=0;
      let carbsum=0;
      for(let i=0;i<response.data.meals.length;i++){
        sum+=response.data.meals[i].nutrition.calories.value;
        proteinsum+=response.data.meals[i].nutrition.protein.value;
        fatsum+=response.data.meals[i].nutrition.fat.value;
        carbsum+=response.data.meals[i].nutrition.carbs.value;
      }
      // setProteinGoal(response.data.user.dailyCalorieRequirement.protein)
      // setFatGoal(response.data.user.dailyCalorieRequirement.fat)
      // setCarbGoal(response.data.user.dailyCalorieRequirement.carbs)
      setCaloriesConsumed(sum);
      setProteinConsumed(proteinsum)
      setCarbConsumed(carbsum)
      setFatConsumed(fatsum)

      // Update last 7 days data structure with today's values
      const today = new Date().toISOString().split("T")[0];
      const updatedCaloriesData = caloriesData.map(data =>
        data.day === today ? { day: today, caloriesConsumed: sum, protein: proteinsum, fat: fatsum, carbs: carbsum } : data
      );

      setCaloriesData(updatedCaloriesData);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  // Update meals whenever the selected date changes
  useEffect(() => {
    fetchMeals(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Update the selected date
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const token = localStorage.getItem('token'); // Retrieve the token from 
    // Create a new FormData object
    const formData = new FormData(event.target);
    
    try {
      const response = await fetch('https://fitfeast.onrender.com/meals/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Send the form data as the request body
      });
  
      if (response.ok) {
        console.log('Meal added successfully');
        setShowModal(false); // Close the modal if needed
        // Fetch the updated list of meals
        await fetchMeals(selectedDate);
      } else {
        // Handle errors from the server
        const errorData = await response.json();
        console.error('Error adding meal:', errorData);
      }
    } catch (error) {
      console.error('Error in request:', error);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (image) => {
    console.log(image)
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };



  

  const [weight, setWeight] = useState("");
    const [weightData, setWeightData] = useState([
        // Initialize with existing weight data
        // { day: '2024-10-20', weight: 70 },
        // { day: '2024-10-21', weight: 71 },
        // { day: '2024-10-22', weight: 50 },
        // { day: '2024-10-23', weight: 57 },
        // { day: '2024-10-24', weight: 80 },
        // { day: '2024-10-25', weight: 71 },
        // Add more initial weight data as needed
    ]);
    // Fetch weights from the backend
    const fetchWeights = async () => {
      const response = await axios.get("https://fitfeast.onrender.com/weight/weights", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Weight Response: ',response);
      setWeightData(response.data);
    };

    useEffect(() => {
      fetchWeights();
    }, []);

    const handleAddWeight = async () => {
      if (weight) {
        const today = new Date().toISOString().split("T")[0]; // Get today's date
    
        // Check if today's weight is already logged
        let existingWeight;
        if(weightData){
          existingWeight = weightData.find(data => data.day === today);
        }
        
        try {
          if (existingWeight) {
            // Update existing weight
            const response = await fetch(`https://fitfeast.onrender.com/weight/weights/${existingWeight._id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                weight: parseFloat(weight)
              }) // Pass the JSON object as the request body
            }); 
          } else {
            const response = await fetch('https://fitfeast.onrender.com/weight/weights', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                day:today,
                weight: parseFloat(weight)
              }) // Pass the JSON object as the request body
            });
            // Add new weight entry for today
            // await fetch(
            //   'https://fitfeast.onrender.com/weight/weights',
            //   {method:'POST'},
            //   { day: today, weight: parseFloat(weight) },
            //   {
            //     headers: {
            //       'Authorization': `Bearer ${localStorage.getItem("token")}`, // Add token from local storage or state
            //     },
            //   }
            // );
          }
    
          setWeight(""); // Clear the input after adding
          await fetchWeights(); // Refresh the weight data
        } catch (error) {
          console.error("Error updating weight:", error);
          alert("There was an error updating your weight. Please try again.");
        }
      } else {
        alert("Please enter a weight.");
      }
    };
    

    // Filter to get only the last 7 days of data
    // const last7DaysData = weightData.filter(data => {
    //   const date = new Date(data.day);
    //   const today = new Date();
    //   const daysDifference = Math.ceil((today - date) / (1000 * 60 * 60 * 24));
    //   return daysDifference <= 8; // Keep data from the last 7 days
    // });

  return (
    <div className={`design-root ${sun ? 'dark-mode' : ''}`}>
      <div className="layout-container">
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
                  <span onClick={toggleSun}>
                    {sun ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-brightness-high" viewBox="0 0 16 16" style={{ height: '30px', width: '30px', marginTop: '27px', marginRight: '10px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
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
                  <a className="nav-link" href="/Profile">
                    User Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="/FitnessProfile">
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
                            strokeDasharray={isAnimated ? `${nutrientProgress}, 100` : "0, 100"} // Trigger animation
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="small-circle-text">
                            {stat.value+'g'}
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
          
          {/* Calorie Graph */}
          <ResponsiveContainer width="100%" height={500}>
              <AreaChart data={caloriesData}>
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
                  <Tooltip />
                  <Legend />
                  
                  <Area
                      type="monotone"
                      dataKey="caloriesConsumed"
                      stroke="#FF6347"
                      fill="url(#colorConsumed)"
                      stackId={2}
                  />
              </AreaChart>
          </ResponsiveContainer>

            {/* Weight Graph */}
            <ResponsiveContainer width="100%" height={500}>
                <AreaChart data={weightData}>
                    <defs>
                        <linearGradient id="colorWeight" x1={0} x2={0} y1={0} y2={1}>
                            <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                            <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    
                    <XAxis dataKey="day" /> {/* Keep x-axis consistent */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#2451B7"
                        fill="url(#colorWeight)"
                        stackId={1}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"

                className="date-picker"
                style={{ padding: '10px', fontSize: '16px', marginRight: '10px',marginTop:'20px' }}
            />
            <button 
                onClick={handleAddWeight} 
                disabled={!weight}
                className="button"
                style={{ padding: '10px 20px', fontSize: '16px', cursor: weight ? 'pointer' : 'not-allowed',justifyContent:'center',alignItems:'center',width:'150px',marginTop:'30px' }}
            >
                Add Weight
            </button>
        </div>
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
                    {/* <FileUploadDemo /> */}
                  </div>
                  {/* <div className="mb-3">
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
                  </div> */}
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
            {meals.length > 0 ? (
              meals.map((post) => (
                <div key={post._id} className="meal-post">
                  <div className="profile-date-container">
                    <img
                      className="prof-pic"
                      src="https://via.placeholder.com/100"
                      alt="Profile"
                    />
                    <strong className="profile-name">{post.category.name}</strong>
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
                  <img className="posts-img" src={post.image} alt="post" onClick={() => openModal(post.image)}
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
                  {/* <div style={{display:'inline-block',width:'500px'}}> */}
                  <div>
                    <p className="post-desc">Calories: {post.nutrition.calories.value}</p>
                    <p className="post-desc">MealType: {post.requestBody.mealType}</p>
                    <p className="post-desc" style={{display:'inline-block',marginRight:'0px'}}>Fat: {post.nutrition.fat.value+post.nutrition.fat.unit+','}</p>
                    <p className="post-desc" style={{display:'inline-block',marginLeft:'10px'}}>Protein: {post.nutrition.protein.value+post.nutrition.protein.unit+','}</p>
                    <p className="post-desc" style={{display:'inline-block',marginLeft:'10px'}}>Carbs: {post.nutrition.carbs.value+post.nutrition.carbs.unit}</p>
                    <p className="post-desc">Posted on: {new Date(post.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</p>
                  </div>
                  
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
