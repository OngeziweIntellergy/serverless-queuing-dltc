import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./Agent.css"; 

function Agent() {
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Text-to-Speech Function
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        } else {
          console.error("Your browser does not support text-to-speech.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
                let data = response.data;
                data = data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

                console.log(data)
                setTickets(data.map(ticket => ({
                    ...ticket,
                    state: ticket.state,  
                    ticketNumber: ticket.ticket_number,
                    ticket_id: ticket.ticket_id
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleTicketSelect = (ticket) => {
        Swal.fire({
            title: `Ticket NO ${ticket.ticketNumber}`,
            html: `<strong>Status:</strong> ${ticket.state}<br/><strong>Description:</strong> ${ticket.user}`,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    };

    const handleAction = async (id, action) => {
        let updatedTickets = [...tickets];

        if (action === 'Serve') {
            updatedTickets = updatedTickets.map(ticket => 
                ticket.ticket_id === id ? { ...ticket, state: 'Serving' } : ticket
            );

            const ticketBeingServed = updatedTickets.find(ticket => ticket.ticket_id === id);
            if (ticketBeingServed) {
                const ticketNumber = ticketBeingServed.ticketNumber;
                const stationNumber = "1"; // Replace with actual station number if available
                speakText(`Now serving ticket number ${ticketNumber} at station number ${stationNumber}.`);
            }
        }

        setTickets(updatedTickets);
    };

    const handleReview = (ticketNumber) => {
        Swal.fire({
            title: 'Review Ticket',
            text: `Review for Ticket NO ${ticketNumber}`,
            icon: 'info',
            confirmButtonText: 'Done'
        });
    };

    const handleSignOut = () => {
        window.location.href = 'https://frontend.d17g06z7kjqaor.amplifyapp.com/login';
    };

    const filteredTickets = tickets.filter(ticket => ticket.ticketNumber && ticket.ticketNumber.toString().includes(searchQuery));

    return (
        <>
            <div className="sign-out-container">
                <button className="btn btn-secondary" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>

            <div>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search ticket by number..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {searchQuery && (
                    <div className="list-group">
                        {filteredTickets.map(ticket => (
                            <button
                                key={ticket.ticket_id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleTicketSelect(ticket)}
                            >
                                Ticket NO {ticket.ticketNumber}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className='container-agent mt-4'>
                {['in Queue', 'Serving', 'Done', 'Cancel'].map((section) => (
                    <div key={section} className="section mb-3">
                        <h2>{section}</h2>
                        <div className="d-flex flex-wrap">
                            {tickets.filter(ticket => ticket.state === section).map(ticket => (
                                <div className='card m-2' style={{ width: '18rem' }} key={ticket.ticket_id}>
                                    <div className='card-body'>
                                        <h5 className='card-title'>Ticket NO {ticket.ticketNumber}</h5>
                                        <div className="d-flex justify-content-between">
                                            {section === 'Cancel' ? (
                                                <button className='btn btn-primary' onClick={() => handleAction(ticket.ticket_id, 'Reinstate')}>Reinstate</button>
                                            ) : (
                                                <button className='btn btn-danger' onClick={() => handleAction(ticket.ticket_id, 'Cancel')}>Cancel</button>
                                            )}
                                            {ticket.state === 'in Queue' && (
                                                <button className='btn btn-success' onClick={() => handleAction(ticket.ticket_id, 'Serve')}>Serve</button>
                                            )}
                                            {section === 'Done' && (
                                                <button className='btn btn-info' onClick={() => handleReview(ticket.ticketNumber)}>Review</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Agent;
