import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Reason.css';

function Reason() {
    const navigate = useNavigate();
    
    const options = [
        'Professional Driving Permit',
        'Driver Renewal Licence',
        'Motor Vehicle License',
        'Operating Licence'
    ];
    const [selectedOption, setSelectedOption] = useState('');

    const generatePayload = (option) => {
        const randomNumber = Math.floor(100 + Math.random() * 900);
        return `${option.charAt(0)}${randomNumber}`;
    };

    const storeInLocalDatabase = (data) => {
        localStorage.setItem('requestDetails', JSON.stringify(data));
    };

    const sendRequest = async (payload) => {
         
        try {
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait.',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await fetch('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.success === true) {
                storeInLocalDatabase(data); // Storing data in local database
                Swal.fire({
                    title: 'Success!',
                    text: 'Your request has been processed.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/ticket');
            }
            console.log('Response:', data);
        } catch (error) {
            Swal.close();
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong: ' + error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error('Error making API request:', error);
        }
    };

    const handleSelect = (option) => {
 
        setSelectedOption(option);
       
        const payload = generatePayload(option);
        sendRequest({
            "option":option,
            "state": "in Queue",
            


          }); 
  
        
    };
    


    return (
        <div className='container-grid'>
            <div className="header">
                <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" loading='lazy' />
                <h1>SMART LICENSING</h1>
            </div>
            <p>Choose from the below options:</p>
            <div className="grid-container">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`grid-item ${selectedOption === option ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reason;


