import React from 'react';
import './Ticket.css'; // Importing the CSS file

const Ticket = ({ ticketNumber }) => {
  return (
    <div className="ticket-container">
      <div className="ticket-number">Ticket Number: {ticketNumber}</div>
      <div className="ticket-message">Look out for your number on the big screen</div>
    </div>
  );
};

export default Ticket;