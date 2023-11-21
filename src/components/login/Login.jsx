import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [activities, setActivities] = useState({
    ProfessionalDrivingPermit: false,
    OperatingLicence: false,
    MotorVehicleLicense: false,
    DriverRenewalLicense: false,
  });
  const [selectedStations, setSelectedStations] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // You'll need to modify this to send the activities and selectedStations
    // as part of your request payload.

    // ...
  };

  const handleActivityChange = (event) => {
    setActivities({
      ...activities,
      [event.target.value]: event.target.checked,
    });
  };

  const handleStationSelect = (event) => {
    setSelectedStations([...event.target.selectedOptions].map(o => o.value));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="cellphone">User Email:</label>
            <input
              type="tel"  
              id="cellphone" 
              value={cellphone} 
              onChange={(e) => setCellphone(e.target.value)} 
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
