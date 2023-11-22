import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Assuming you have a CSS file for styling

function Login() {

  const navigate = useNavigate(); // Create an instance of useNavigate for navigation
  const [username, setUsername] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [activities, setActivities] = useState({ // State for activities
    ProfessionalDrivingPermit: false,
    OperatingLicence: false,
    MotorVehicleLicense: false,
    DriverRenewalLicense: false,
  });
  const [selectedStations, setSelectedStations] = useState([]); // State for selected stations

  // Function to handle checkbox changes
  const handleActivityChange = (event) => {
    setActivities({
      ...activities,
      [event.target.value]: event.target.checked,
    });
  };

  // Function to handle station selection
  const handleStationSelect = (event) => {
    setSelectedStations([...event.target.selectedOptions].map(o => o.value));
  };
  const payload={
    username,
    password,
    activities,
    selectedStations}
  

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(payload)
      const response = await fetch('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                body: JSON.stringify(payload),
            });
      // const response = await axios.post('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/login', {
      //   method: 'post',
      //   headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      //   body: JSON.stringify(payload)
      // });
      console.log(response)
      navigate('/agent');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Smart Licensing Logo" className="login-logo"/>
        <h2 className="login-title">Login</h2>
        <p className="welcome-text">Welcome to SMART LICENSING</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* <div className="input-group">
            <label htmlFor="email">User Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div> */}

          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <fieldset className="input-group">
            <legend>What will you be doing Today?</legend>
            {Object.keys(activities).map((activity) => (
              <label key={activity}>
                <input
                  type="checkbox"
                  value={activity}
                  checked={activities[activity]}
                  onChange={handleActivityChange}
                />
                {activity}
              </label>
            ))}
          </fieldset>

          <div className="input-group">
            <label htmlFor="stations">Select Station:</label>
            <select
              id="stations"
              name="stations"
              value={selectedStations}
              onChange={handleStationSelect}
            >
              {Array.from({ length: 16 }, (_, i) => (
                <option key={i} value={`Station ${i + 1}`}>{`Station ${i + 1}`}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
