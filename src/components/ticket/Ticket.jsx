import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ticket.css';

const Ticket = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [ticketState, setTicketState] = useState('');
  const [numberInQueue, setNumberInQueue] = useState('');

  useEffect(() => {
    const storedTicketData = localStorage.getItem('requestDetails');
    if (storedTicketData) {
      const ticketDetails = JSON.parse(storedTicketData);
      let resdata = ticketDetails.data;
      calculateNumberInQueue(resdata.datetime, resdata.option);
      setTicketNumber(resdata.ticket_number);
      setReason(resdata.option);
      setTicketState(resdata.state);
    }
  }, []);

  const countTicketsBefore = (tickets, currentTicketDateTime, option) => {
    return tickets.filter(ticket => 
      new Date(ticket.datetime) < new Date(currentTicketDateTime) && ticket.option === option
    ).length;
  };

  const calculateNumberInQueue = async (dateTime, option) => {
    try {
      const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
      const tickets = response.data;
      const numberBefore = countTicketsBefore(tickets, dateTime, option);
      setNumberInQueue(numberBefore);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    }
  };

  return (
    <div className="ticket-container">
      <div className="header">
        <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" />
        <h1 className="welcome-text">Welcome to SMART LICENSING</h1>
      </div>
      <div className="ticket-info">
        <div className="ticket-number-container">
          <p className="ticket-number">Ticket NO: <span className='ticket-number-color'>{ticketNumber}</span> </p>
          <p>Number in Queue: {numberInQueue}</p>
          <small>Reason for visit: {reason}</small>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
