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

