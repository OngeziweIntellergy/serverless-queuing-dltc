import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./Agent.css"; 



function Agent() {
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [servedCount, setServedCount] = useState(0);
    const [doneCount, setDoneCount] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets'); // Replace with your data URL
                let data = response.data;
                data = data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
                console.log(data)
                
                const processedTickets = data.map(ticket => ({
                    ...ticket,
                    state: ticket.state,  
                    ticketNumber: ticket.ticket_number,
                    ticket_id: ticket.ticket_id
                }));
                setTickets(processedTickets);
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        updateCounters();
    }, []);

    const updateCounters = () => {
        setServedCount(tickets.filter(ticket => ticket.state === 'Serving').length);
        setDoneCount(tickets.filter(ticket => ticket.state === 'Done').length);
    };


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

    const filteredTickets = tickets.filter(ticket => ticket.ticketNumber && ticket.ticketNumber.toString().includes(searchQuery));


    const handleSignOut = () => {
        //This is the sign out link redirecting you back to sign in
        window.location.href = 'https://dltc-login.auth.us-east-1.amazoncognito.com/login?client_id=546ingr1kv2p9r9mfcot8v321i&response_type=code&scope=openid&redirect_uri=https%3A%2F%2Ffrontend.d17g06z7kjqaor.amplifyapp.com%2Fagent';
    };

    

    const handleAction = async (id, action) => {
        let updatedTickets = [...tickets];
        updateTicketState(id,action)
        

        if (action === 'Serving') {
            const currentlyServingTicket = updatedTickets.find(ticket => ticket.state === 'Serving');
        
            // If there's a ticket being served, move it to 'Done'
            if (currentlyServingTicket) {
                const updatedServingTicket = { ...currentlyServingTicket, state: 'Done' };
                updatedTickets = updatedTickets.map(ticket => 
                    ticket.ticket_id === currentlyServingTicket.ticket_id ? updatedServingTicket : ticket
                );
                 updateTicketState(currentlyServingTicket.ticket_id, 'Done');
            }

            // Set the selected ticket to 'Serving'
            updatedTickets = updatedTickets.map(ticket =>
                ticket.ticket_id === id ? { ...ticket, state: 'Done' } : ticket
            );
        } else {
            // Handle other actions (Cancel, Done, Reinstate)
            updatedTickets = updatedTickets.map(ticket => {
                if (ticket.ticket_id === id) {
                    return { ...ticket, state: action };
                }
                return ticket;
            });
        }

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
                    return; 
                }
 
            }
        }

        if (action === 'in Queue') {
            // Remove the ticket from its current position
            updatedTickets = updatedTickets.filter(ticket => ticket.ticket_id !== id);
            // Add it back to the start of the queue with state 'in Queue'
            updatedTickets.unshift({ ...tickets.find(ticket => ticket.ticket_id === id), state: 'in Queue' });
        } else if (action === 'Serving') {
            // Find and move the currently serving ticket to 'Done', if any
            updatedTickets = updatedTickets.map(ticket => 
                ticket.state === 'Serving' ? { ...ticket, state: 'Done' } : ticket
            );
            // Set the selected ticket to 'Serving'
            updatedTickets = updatedTickets.map(ticket => 
                ticket.ticket_id === id ? { ...ticket, state: 'Serving' } : ticket
            );
        } else {
            // Handle other actions (Cancel, Done)
            updatedTickets = updatedTickets.map(ticket => {
                if (ticket.ticket_id === id) {
                    return { ...ticket, state: action };
                }
                return ticket;
            });
        }

        setTickets(updatedTickets);
        updateCounters();
        await updateTicketState(id, action);
    };
   

    const updateTicketState = async (id, newState) => {
       
        try {
            const response = await axios.put(`https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket`, { state: newState, ticket_id: id });
            
            return response.data;
        } catch (error) {
            console.error("Error updating ticket:", error);

        }
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
            <div className='search-bar'>
                
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
            <div className='manage-page'>
            
            <button className="btn btn-secondary" onClick={handleSignOut}>
                Sign Out
            </button>

            </div>
            
            
        </div>

        
        
            <h3>Tickets Done: {doneCount}</h3>

           
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
                                            <button className='btn btn-primary' onClick={() => handleAction(ticket.ticket_id, 'in Queue')}>Reinstate</button>
                                        ) : (
                                            <button className='btn btn-danger' onClick={() => handleAction(ticket.ticket_id, 'Cancel')}>Cancel</button>
                                        )}
                                        {ticket.state === 'in Queue' && (
                                            <button className='btn btn-success' onClick={() => handleAction(ticket.ticket_id, 'Serving')}>Serve</button>
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
