import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Reason.css';

function Reason() {
    const navigate = useNavigate();
    
    
    const options = [
        'Professional Driving Permit',
        'Drivers License',
        'Motor Vehicle License',
        'Operator License'
    ];
    const [selectedOption, setSelectedOption] = useState(null);

    const generatePayload = (option) => {
        // Generate a 3-digit number
        const randomNumber = Math.floor(100 + Math.random() * 900);
        // Extract the first letter of the option and append the number
        return `${option.charAt(0)}${randomNumber}`;
    };

    const sendRequest = async (payload) => {
        
        try {
            // Show loading alert
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
                body: JSON.stringify({
                    "user-id": "12345",
                    "reason": "Inquiry about services",
                    "datetime": "2023-03-15T14:30:00",
                    "user": "user@example.com",
                    "process": "Initial"
                  }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.success === true) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your request has been processed.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500 // auto close after 1500ms
                });
    
                // Redirect to '/ticket' after the alert
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
        sendRequest(payload); 
    };

    return (
        <div className='container-grid'>
            <div className="header">
                <img src="https://dltccoffeeimages.s3.amazonaws.com/gauteng_dept_of_transport.jpeg" alt="Logo" className="logo" loading='lazy' />
                <h1>SMART DLTC</h1>
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
