import React from 'react';
import './Ticket.css'; // Importing the CSS file

const Ticket = ({ ticketNumber, progress }) => { // Add a progress prop
  return (
    <div className="ticket-container">
      <div className="header">
    <img src="https://dltccoffeeimages.s3.amazonaws.com/gauteng_dept_of_transport.jpeg" alt="Logo" className="logo" />
    <h1 className="welcome-text">Welcome to SMART DLTC</h1>
  </div>
  <div className="ticket-info">
    <div className="ticket-number-container">
      <p className="ticket-number">Ticket Number:</p>
    </div>
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: '50%' }}></div>
    </div>
  </div>
    </div>
  );
};

export default Ticket;


// import React from 'react';
// import './Ticket.css'; // Importing the CSS file

// const Ticket = ({ ticketNumber }) => {
//   return (
//     <div className="ticket-container">
//       <div className="ticket-number">Ticket Number: {ticketNumber}</div>
//       <div className="ticket-message">Look out for your number on the big screen</div>
//     </div>
//   );
// };

// export default Ticket;