import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [cellphone, setCellphone] = useState('');
  //const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://your-backhttps://pzv5egxa4k.execute-api.us-east-1.amazonaws.com/Prodend-api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cellphone, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            // Handle successful login
            // e.g., saving the token, updating the authentication state
        } else {
            // Handle errors, e.g., show a message to the user
        }
    } catch (error) {
        console.error('Registration failed:', error);
        // Handle network error
    }
};



  return (
    <div className="login-container">
      {/* <img src="https://dltccoffeeimages.s3.amazonaws.com/Gauteng+transport.jpeg"></img> */}
      <div className="login-box">
        <h2 className="login-title">Register here</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div> */}

          <div className="input-group">
          <label htmlFor="cellphone">Cellphone Number:</label>
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

          <div className="input-group">
          <label htmlFor="dropdown">What will you be doing Today? </label>
          <select id="options" name="options" >
          <option value="Professional Driving Permit">Professional Driving Permit</option>
          <option value="Operating Licence">Operating Licence</option>
          <option value="Motor Vehicle License">Motor Vehicle License</option>
          <option value="Driver Renewal Licenc">Driver Renewal Licenc</option>
          
        </select>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

