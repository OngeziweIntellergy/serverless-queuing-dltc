import React, { useEffect, useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import {requestPermission, onMessageListener} from "../firebase"
import axios from 'axios';
import './Ticket.css';
// import { Toast } from 'bootstrap';

const Ticket = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [ticketState, setTicketState] = useState('');
  const [numberInQueue, setNumberInQueue] = useState('');
  const [estimatedServiceTime, setEstimatedServiceTime] = useState('');
  // const [notification, setNotification] = useState({title:"", body:""})

  useEffect(() => {
    // requestPermission();
    const storedTicketData = localStorage.getItem('requestDetails');
    if (storedTicketData) {
      const ticketDetails = JSON.parse(storedTicketData);
      let resdata = ticketDetails.data;
      calculateNumberInQueue(resdata.datetime, resdata.option);
      setTicketNumber(resdata.ticket_number);
      setReason(resdata.option);
      setTicketState(resdata.state);
      const intervalId = setInterval(() => {
        updateQueueInfo();
      }, 60000); // Update every 60 seconds
  
      return () => clearInterval(intervalId);
      // const unsubscribe = onMessageListener().then(payload=>{
      //   setNotification({
      //     title:"Move closer to the center",
      //     body: resdata.ticketNumber +" move closer to the stattion"
      //   })
      // })
      // return ()=>{
      //   unsubscribe.catch(err=>console.log("failed", err))
      // }
    }
  }, []);
  const updateQueueInfo = async () => {
    const storedTicketData = localStorage.getItem('requestDetails');
    if (storedTicketData) {
      const ticketDetails = JSON.parse(storedTicketData);
      let resdata = ticketDetails.data;
      calculateNumberInQueue(resdata.datetime, resdata.option);
    }
  };

  const countTicketsBefore = (tickets, currentTicketDateTime, option) => {
    return tickets.filter(ticket => 
      new Date(ticket.datetime) < new Date(currentTicketDateTime) &&
      ticket.option === option &&
      ticket.state === 'in Queue'
    ).length;
  };

  const calculateNumberInQueue = async (dateTime, option) => {
    try {
      const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
      const tickets = response.data;
      const numberBefore = countTicketsBefore(tickets, dateTime, option);
      setNumberInQueue(numberBefore);
      calculateEstimatedServiceTime(numberBefore);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    }
  };

  const calculateEstimatedServiceTime = (numberBefore) => {
    const averageWaitTimePerPerson = 15; // Average wait time in minutes per person
    const totalWaitTime = numberBefore * averageWaitTimePerPerson; // Total wait time in minutes

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + totalWaitTime);
    console.log(currentTime)

    // Converting to South African Standard Time (SAST) UTC+2
    const sastTime = new Date(currentTime.getTime() + (2 * 60 * 60 * 1000)); // Adding 2 hours for SAST
    setEstimatedServiceTime(currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' , hour24: true}));
  };

  return (
    <div className="ticket-container">
      {/* <Toaster /> */}
      <div className="header">
        <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" />
        <h1 className="welcome-text">Welcome to SMART LICENSING</h1>
      </div>
      <div className="ticket-info">
        <div className="ticket-number-container">
          <p className="ticket-number">Ticket NO: <span className='ticket-number-color'>{ticketNumber}</span> </p>
          <p>Number in Queue: {numberInQueue}</p>
          <p>Estimated Service Time: {estimatedServiceTime}</p>
          <small>Reason for visit: {reason}</small>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
