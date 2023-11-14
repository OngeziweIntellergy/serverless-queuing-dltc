import React from 'react';
import './Ticket.css'; // Importing the CSS file

const Ticket = ({ ticketNumber, progress }) => { // Add a progress prop
  return (
    <div className="ticket-container">
      <div className="ticket-number">Ticket Number: {ticketNumber}</div>
      <div className="ticket-message">Look out for your number on the big screen</div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div> {/* Inline style for dynamic width */}
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