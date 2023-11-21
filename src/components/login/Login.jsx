import React, { useState } from 'react';
import axios from 'axios';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activities, setActivities] = useState({
    ProfessionalDrivingPermit: false,
    OperatingLicence: false,
    MotorVehicleLicense: false,
    DriverRenewalLicense: false,
  });
  const [selectedStations, setSelectedStations] = useState([]);

  const handleActivityChange = (event) => {
    setActivities({
      ...activities,
      [event.target.value]: event.target.checked,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ email, password,
      activities,
      selectedStations
  })
  
    try {
      const response = await axios.post('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/login', {
        email,
        password,
        activities,
        selectedStations
      });
      console.log(response.data);
      // Handle success (e.g., redirect to a dashboard)
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleStationSelect = (event) => {
    setSelectedStations([...event.target.selectedOptions].map(o => o.value));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" method='POST' onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">User Email:</label>
            <input
              type="email"  
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
