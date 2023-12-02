import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you have a CSS file for styling

function Login() {

  const navigate = useNavigate(); // Create an instance of useNavigate for navigation
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [activities, setActivities] = useState({ // State for activities
    ProfessionalDrivingPermit: false,
    OperatingLicence: false,
    MotorVehicleLicense: false,
    DriverRenewalLicense: false,
  });
  const [selectedStations, setSelectedStations] = useState([]); // State for selected stations
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

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

  // Payload for login request
  const payload = {
    username,
    password,
    activities,
    selectedStations
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',                    
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/agent');
      } else {
        const responseData = await response.json();
        setErrorMessage(responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Smart Licensing Logo" className="login-logo"/>
        <h2 className="login-title">Login</h2>
        <p className="welcome-text">Welcome to SMART LICENSING</p>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

        <form className="login-form" onSubmit={handleSubmit}>
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
