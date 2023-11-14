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
  
    const handleSelect = (option) => {
      setSelectedOption(option);
    };
  
    return (
        <div className='container-grid'>
            {/* Logo and Heading */}
            <div className="header">
                <img src="https://dltccoffeeimages.s3.amazonaws.com/gauteng_dept_of_transport.jpeg" alt="Logo" className="logo" />
                <h1>SMART DLTC</h1>
            </div>
    
            {/* Instruction Text */}
            <p>Choose from the below options:</p>
    
            {/* Options Grid */}
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

