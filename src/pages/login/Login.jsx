import React, { useState } from 'react';
import { setUserSession } from '../../service/AuthService';
import axios from 'axios';
import './Login.css'; 
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';



function Login() {
  const navigate = useNavigate();
  const [password, setPassword]= useState('');
  const [username, setUsername]= useState('');
  const [reason, setReason] = useState({
    Professional_Driving_Permit: false,
    Diver_Renewal_License: false,
    Motor_Vehicle_License: false,
    Operating_License: false,
    checkAll: false,
  })
  const updateCheckboxes = (checked) => {
    document.getElementById('Professional_Driving_Permit').checked = checked;
    document.getElementById('Diver_Renewal_License').checked = checked;
    document.getElementById('Motor_Vehicle_License').checked = checked;
    document.getElementById('Operating_License').checked = checked;
  };
  const submitHandler =(e)=>{
    e.preventDefault();
    let loginUrl = "https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/login";
    const requestConfig = {
      headers: {
      'x-api-key': 'gNzOqOhI5771BmV6rw2962Usc4rpTtnPvxlWzVf4'
      }
    }
    const requestBody ={
      username:username,
      password:password,  
    }
  
    axios.post(loginUrl, requestBody, requestConfig).then(response=>{
      setUserSession(response.data.user, response.data.token)
      showOptions();
      console.log(response)}).catch(error=>{
        console.log(error)
        // if(error.response.status){
        //   console.log(error.response.data.message)
        // }else{
        //   console.log("server error.")
        // }

    })
  }


  const showOptions = () => {
    Swal.fire({
      title: 'Select Options',
      html: `
        <div style="text-align: left;">
        <label>
            <input type="checkbox" id="checkAll" class="check-all">
            Check All
          </label><br>
          <label>
            <input type="checkbox" id="Professional_Driving_Permit">
            Professional Driving Permit
          </label><br>

          <label>
            <input type="checkbox" id="Diver_Renewal_License">
            Diver Renewal License
          </label><br>

          <label>
            <input type="checkbox" id="Motor_Vehicle_License">
            Motor Vehicle License
          </label><br>

          <label>
            <input type="checkbox" id="Operating_License">
            Operating License
          </label><br>

          
        </div>
      `,
      didOpen: () => {
        document.getElementById('checkAll').addEventListener('change', (e) => {
          updateCheckboxes(e.target.checked);
        });
      },
      preConfirm: () => {
        return {
          Professional_Driving_Permit: document.getElementById('Professional_Driving_Permit').checked,
          Diver_Renewal_License: document.getElementById('Diver_Renewal_License').checked,
          Motor_Vehicle_License: document.getElementById('Motor_Vehicle_License').checked,
          Operating_License: document.getElementById('Operating_License').checked,
          checkAll: document.getElementById('checkAll').checked,
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed) {
        setReason(result.value);
        console.log('Selected options:', result.value);
        navigate('/dashboard')
        // Send data to your endpoint
        // Example: axios.post('your-endpoint', result.value)
      }
    });
  };

  return (

    <div className="registration-form">
      <form onSubmit={submitHandler}>
        <div className="form-icon">
            <span><i className="icon icon-user"></i></span>
        </div>
        <div className="form-group">
            <input type="text" className="form-control item"  value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Username" required/>
        </div>
        <div className="form-group">
            <input type="password" className="form-control item" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
        </div>
        <div className="form-group">
            <input type="submit" className="btn btn-block create-account" value="Login" />
        </div>
      </form>
    </div>

  );
}

export default Login;
