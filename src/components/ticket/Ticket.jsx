import React,{useEffect, useState} from 'react';
import './Ticket.css'; // Importing the CSS file

const Ticket = ({ progress }) => { 
  
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    // Fetching ticket number from local storage
    const storedTicketData = localStorage.getItem('requestDetails');
   


    console.log(storedTicketData)
    if (storedTicketData) {
          const ticketDetails = JSON.parse(storedTicketData);
          console.log(ticketDetails)
          let resdata = ticketDetails.data
          console.log(resdata)
          setTicketNumber(resdata.ticket_number)
          setReason(resdata.option)
          setState(resdata.state)
          
      
    }
  }, []);
  return (
    <div className="ticket-container">
      <div className="header">
    <img src="https://dltccoffeeimages.s3.amazonaws.com/gauteng_dept_of_transport.jpeg" alt="Logo" className="logo" />
    <h1 className="welcome-text">Welcome to SMART DLTC</h1>
  </div>
  <div className="ticket-info">
    <div className="ticket-number-container">
      <p className="ticket-number">Ticket Number: {ticketNumber}</p>
      <small className="ticket-number">Reason: {reason}</small><br/>
      <small className="ticket-number">State: {state}</small>
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