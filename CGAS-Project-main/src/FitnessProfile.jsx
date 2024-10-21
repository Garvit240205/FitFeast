import React from "react";
import { useState,useEffect } from "react";
import "./FitnessProfile.css";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const calorieGoal = 3000;
  const caloriesConsumed = 2055;
  const progressPercentage = (caloriesConsumed / calorieGoal) * 100;
  const [sun, setSun] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setIsAnimated(true);
    // Initialize with some posts for the sake of the example
    setPosts([
      { id: 1, username: "JohnDoe", meal: "Breakfast", date: "2024-10-20", description: "Omelette, Toast, and Orange Juice" },
      { id: 2, username: "JaneDoe", meal: "Lunch", date: "2024-10-20", description: "Chicken Salad with Avocado" },
      { id: 3, username: "JohnDoe", meal: "Dinner", date: "2024-10-19", description: "Grilled Salmon with Veggies" },
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
  const handleAddPost = () => {
    alert("Add Post clicked!");
  };
  const nutrientData = {
    labels: nutrients.map((n) => n.label),
    datasets: [
      {
        label: "Consumed",
        data: nutrients.map((n) => n.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Goal",
        data: nutrients.map((n) => n.goal),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Data for Area Chart (Calorie Trend)
  const calorieTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Calories Consumed",
        data: [1800, 2200, 2100, 1900, 2500, 2300, 2055],
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.4)", // Add this line for the area effect
        fill: true, // Enable area fill
        tension: 0.4,
        pointRadius: 5,
      },
      {
        label: "Calories Burned",
        data: [1600, 2000, 1800, 1700, 2400, 2100, 2000],
        borderColor: "rgba(255, 159, 64, 0.8)",
        backgroundColor: "rgba(255, 159, 64, 0.4)", // Add this line for the area effect
        fill: true, // Enable area fill
        tension: 0.4,
        pointRadius: 5,
      },
    ],
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
            {[{ label: "Calories consumed", value: "2,055" },
              { label: "Calories burned", value: "2,000" }
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

              
              <Area
                type="monotone"
                dataKey="caloriesBurned"
                stroke="#2451B7"
                fill="url(#colorBurned)"
                stackId={1}
              />
              
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
          {/* Floating Action Button */}
          <button 
            className="snap-button" 
            onClick={handleAddPost}
          >
            <div className="snap-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera" viewBox="0 0 20 20" style={{marginTop:'5px'}}>
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
          <h2>Meals Consumed</h2>
          <div className="date-picker-container">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-picker"
            />
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
                  <img className="posts-img" src="public/Thor.jpg"></img>
                  <p className="post-desc">{post.description}</p>
                  <p className="post-desc">Calories: 200kcal</p>
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
