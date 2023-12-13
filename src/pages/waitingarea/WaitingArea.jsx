import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WaitingArea.css';

function WaitingArea() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [upcomingTickets, setUpcomingTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
        const servingTask = result.data.find(task => task.state === 'Serving');
        const queueTasks = result.data.filter(task => task.state === 'in Queue');

        setCurrentTicket(servingTask);
        setUpcomingTickets(queueTasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentTicket]);

  return (
    <div className="waiting-area">
        <div className='waiting-area-left'>
            {currentTicket && (
              <>
                <p className='ticket-number'>{currentTicket.ticket_number}</p>
                <p className='service-station'>is now being served at Station: <span className='text-color'>{currentTicket.station}</span></p>
              </>
            )}
        </div>
        <div className='waiting-area-right'>
            <h2>Upcoming Tickets</h2>
            {upcomingTickets.map((ticket, index) => (
              <div key={index} className='waiting-ticket-side'> <p>{ticket.ticket_number}</p> </div>
            ))}
        </div>
    </div>
  );
}

export default WaitingArea;
