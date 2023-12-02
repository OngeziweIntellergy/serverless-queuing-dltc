import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Ticket.css';

const Ticket = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [numberInQueue, setNumberInQueue] = useState(0);
  const [estimatedServiceTime, setEstimatedServiceTime] = useState('');
  const [serviceTime, setServiceTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const calculateNumberInQueue = useCallback(async (dateTime, option) => {
    try {
      const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
      const tickets = response.data;
      const numberBefore = countTicketsBefore(tickets, dateTime, option);
      setNumberInQueue(numberBefore);
      calculateEstimatedServiceTime(numberBefore);
    } catch (error) {
      Swal.fire("Error", "Error fetching tickets: " + error.message, "error");
    }
  }, []);

  useEffect(() => {
    const updateQueue = async () => {
      const storedTicketData = localStorage.getItem('requestDetails');
      if (storedTicketData) {
        const ticketDetails = JSON.parse(storedTicketData);
        let resdata = ticketDetails.data;
        await calculateNumberInQueue(resdata.datetime, resdata.option);
        setTicketNumber(resdata.ticket_number);
        setReason(resdata.option);
      }
    };
    updateQueue();
    
    const intervalId = setInterval(updateQueue, 10000); // Update queue every 10 seconds
    return () => clearInterval(intervalId);
  }, [calculateNumberInQueue]);

 

  const startServiceTimer = useCallback(() => {
    setTimer(setInterval(() => {
      setServiceTime(time => time + 1);
    }, 1000));
  }, []);
  
  const stopServiceTimer = useCallback(() => {
    clearInterval(timer);
    setTimer(null);
    Swal.fire({
      title: 'Rate Our Service',
      text: 'Please rate the service you received.',
      icon: 'question',
      input: 'range',
      inputAttributes: {
        min: 1,
        max: 5,
        step: 1
      },
      inputLabel: 'Rating',
      confirmButtonText: 'Submit'
    }).then(result => {
      if (result.value) {
        updateTicketWithTimeAndRating(serviceTime, result.value);
        setServiceTime(0);
      }
    });
  }, [timer, serviceTime]);
  useEffect(() => {
    if (numberInQueue === 1 && !timer) {
      startServiceTimer();
      console.log(numberInQueue)
      console.log(startServiceTimer())
    } else if (numberInQueue < 1 && timer) {
      stopServiceTimer();
    }
  }, [numberInQueue, timer, startServiceTimer, stopServiceTimer]);
  const updateTicketWithTimeAndRating = async (time, rating) => {
    try {
      await axios.put(`https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket`, {
        serviceTime: time,
        serviceRating: rating
      });
    } catch (error) {
      Swal.fire("Error", "Error updating ticket: " + error.message, "error");
    }
  };

  const countTicketsBefore = (tickets, currentTicketDateTime, option) => {
    const count = tickets.filter(ticket => 
      new Date(ticket.datetime) < new Date(currentTicketDateTime) &&
      ticket.option === option &&
      ticket.state === 'in Queue'
    ).length;

    return count +1;
  };

  const calculateEstimatedServiceTime = (numberBefore) => {
    const averageWaitTimePerPerson = 15;
    const totalWaitTime = numberBefore * averageWaitTimePerPerson;

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + totalWaitTime);

    setEstimatedServiceTime(currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour24: true }));
  };

  const queueMessage = () => {
    if (numberInQueue === 1) {
      console.log(numberInQueue)
      return "Move closer, you're next in line!";
    } else if (numberInQueue === 2) {
      console.log(numberInQueue)

      return "Move closer, you're second in line!";
    } else if(numberInQueue === 0){
      console.log(numberInQueue)
      return "Currently serving";
    } else {
      return <span className='ticket-number-color-fontSize'>{numberInQueue}</span>;
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
          <p className="ticket-number">Ticket NO: <span className='ticket-number-color'>{ticketNumber}</span></p>
          <p>Number in Queue: <span className='ticket-number-color-fontSize'>{queueMessage()}</span></p>
          <p>Estimated Service Time: <span className='ticket-number-color-fontSize'>{estimatedServiceTime}</span></p>
          <p>Reason for visit: <span className='ticket-number-color-bold'>{reason}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
