import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./Agent.css"; 
import data from './../../data.json';

function Agent() {
    const [tickets, setTickets] = useState(data);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleTicketSelect = (ticket) => {
        Swal.fire({
            title: `Ticket NO ${ticket.ticketNumber}`,
            html: `<strong>Status:</strong> ${ticket.status}<br/><strong>Description:</strong> ${ticket.description}`,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    };

    const filteredTickets = tickets.filter(ticket => ticket.ticketNumber.toString().includes(searchQuery));


const handleAction = (id, action) => {
    // Function to actually cancel the ticket
    const cancelTicket = () => {
        let updatedTickets = tickets.map(ticket => {
            if (ticket.id === id && action === 'Cancel') {
                return { ...ticket, status: 'Cancelled' };
            }
            return ticket;
        });
        setTickets(updatedTickets);
    };

    // If Cancel is clicked on a ticket in the Serving lane
    if (action === 'Cancel') {
        const ticketToCancel = tickets.find(ticket => ticket.id === id);
        if (ticketToCancel && ticketToCancel.status === 'Serving') {
            Swal.fire({
                title: 'Cancel Ticket',
                text: 'Select a reason for cancellation:',
                input: 'select',
                inputOptions: {
                    Delayed: 'Delayed',
                    Missing : 'Missing Documents',
                    Missing : 'Missing Documents',
                    other: 'Other'
                },
                inputPlaceholder: 'Select a reason',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    cancelTicket();
                }
            });
        } else {
            cancelTicket();
        }
    } else {
        let updatedTickets = tickets.map(ticket => {
            // If a ticket is being served, move the currently serving ticket to done
            if (action === 'Serve' && ticket.status === 'Serving') {
                return { ...ticket, status: 'Done' };
            }
    
            if (ticket.id === id) {
                switch (action) {
                    case 'Cancel':
                        return { ...ticket, status: 'Cancelled' };
                    case 'Serve':
                        return { ...ticket, status: 'Serving' };
                    case 'Done':
                        return { ...ticket, status: 'Done' };
                    case 'Reinstate':
                        return { ...ticket, status: 'In Queue' };
                    default:
                        return ticket;
                }
            }
            return ticket;
        });
    
        setTickets(updatedTickets);
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
                            key={ticket.id}
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
        
            {['In Queue', 'Serving', 'Done', 'Cancelled'].map((section) => (
                <div key={section} className="section mb-3">
                    <h2>{section}</h2>
                    <div className="d-flex flex-wrap">
                        {tickets.filter(ticket => ticket.status === section).map(ticket => (
                            <div className='card m-2' style={{ width: '18rem' }} key={ticket.id}>
                                <div className='card-body'>
                                    <h5 className='card-title'>Ticket NO {ticket.ticketNumber}</h5>
                                    <div className="d-flex justify-content-between">
                                        {section === 'Cancelled' ? (
                                            <button className='btn btn-primary' onClick={() => handleAction(ticket.id, 'Reinstate')}>Reinstate</button>
                                        ) : (
                                            <button className='btn btn-danger' onClick={() => handleAction(ticket.id, 'Cancel')}>Cancel</button>
                                        )}
                                        {ticket.status === 'In Queue' && (
                                            <button className='btn btn-success' onClick={() => handleAction(ticket.id, 'Serve')}>Serve</button>
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
