import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./Agent.css"; 

function Agent() {
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets'); // Replace with your data URL
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

    // const filteredTickets = tickets.filter(ticket => ticket.ticketNumber.toString().includes(searchQuery));
    const filteredTickets = tickets.filter(ticket => ticket.ticketNumber && ticket.ticketNumber.toString().includes(searchQuery));


    const handleSignOut = () => {
        //This is the sign out link redirecting you back to sign in
        window.location.href = 'https://frontend.d17g06z7kjqaor.amplifyapp.com/login';
    };


    // const handleAction = (id, action) => {
    //     let updatedTickets = [...tickets];
    //     let currentlyServing = updatedTickets.find(ticket => ticket.state === 'Serving');

    //     if (action === 'Serve') {
    //         if (currentlyServing) {
    //             // If there is a ticket currently being served, move it to 'Done'
    //             updatedTickets = updatedTickets.map(ticket => {
    //                 if (ticket.ticket_id === currentlyServing.ticket_id) {
    //                     return { ...ticket, state: 'Done' };
    //                 }
    //                 return ticket;
    //             });
    //         }
    //         // Set the selected ticket to 'Serving'
    //         updatedTickets = updatedTickets.map(ticket => {
    //             if (ticket.ticket_id === id) {
    //                 return { ...ticket, state: 'Serving' };
    //             }
    //             return ticket;
    //         });
    //     } else {
    //         // Handle other actions (Cancel, Done, Reinstate)
    //         updatedTickets = updatedTickets.map(ticket => {
    //             if (ticket.ticket_id === id) {
    //                 let newState = '';
    //                 switch (action) {
    //                     case 'Cancel':
    //                         newState = 'Cancel';
    //                         break;
    //                     case 'Done':
    //                         newState = 'Done';
    //                         break;
    //                     case 'Reinstate':
    //                         newState = 'in Queue';
    //                         break;
    //                     default:
    //                         newState = ticket.state; // No change in state
    //                 }
    //                 return { ...ticket, state: newState };
    //             }
    //             return ticket;
    //         });
    //     }

    //     setTickets(updatedTickets);
    // };

    const handleAction = async (id, action) => {
        let updatedTickets = [...tickets];

        if (action === 'Cancel') {
            const ticketToCancel = updatedTickets.find(ticket => ticket.ticket_id === id);
            if (ticketToCancel && ticketToCancel.state === 'Serving') {
                const result = await Swal.fire({
                    title: 'Cancel Ticket',
                    text: 'Select a reason for not attending the customer:',
                    input: 'select',
                    inputOptions: {
                        'no-show': 'Customer No-Show',
                        'closed': 'Service Closed',
                        'other': 'Other'
                    },
                    inputPlaceholder: 'Select a reason',
                    showCancelButton: true
                });

                if (!result.isConfirmed) {
                    return; // Exit the function if cancelled
                }
                // If confirmed, proceed to update the ticket state to 'Cancel'
            }
        }

        if (action === 'Reinstate') {
            // Remove the ticket from its current position and add it to the start of the queue
            updatedTickets = updatedTickets.filter(ticket => ticket.ticket_id !== id);
            updatedTickets.unshift({ ...tickets.find(ticket => ticket.ticket_id === id), state: 'in Queue' });
        } else if (action === 'Serve') {
            // Move any currently serving ticket to 'Done'
            updatedTickets = updatedTickets.map(ticket => 
                ticket.state === 'Serving' ? { ...ticket, state: 'Done' } : ticket
            );
            // Set the selected ticket to 'Serving'
            updatedTickets = updatedTickets.map(ticket => 
                ticket.ticket_id === id ? { ...ticket, state: 'Serving' } : ticket
            );
        } else {
            // Update the ticket state for other actions (Cancel, Done)
            updatedTickets = updatedTickets.map(ticket => {
                if (ticket.ticket_id === id) {
                    return { ...ticket, state: action };
                }
                return ticket;
            });
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
        <div className='container-agent  mt-4'>
        
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
