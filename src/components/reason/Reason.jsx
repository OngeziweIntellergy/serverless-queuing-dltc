import React, { useState } from 'react';
import './Reason.css';

function Reason() {
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
            const response = await fetch('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({
                    "ticket-id": "2938939488459436",
                    "user-id": "user456",
                    "reason": "Inquiry",
                    "datetime": "2023-11-13T12:00:00",
                    "user": "John Doe",
                    "process": "Online Submission"
                
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error making API request:', error);
        }
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        const payload = generatePayload(option);
        sendRequest(payload); // Send the payload to the AWS endpoint
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
