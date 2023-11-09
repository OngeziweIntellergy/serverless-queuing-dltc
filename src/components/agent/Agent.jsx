import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "./Agent.css";
import data from './../../data.json';

function Agent() {
    const [tickets, setTickets] = useState(data);



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
                        return { ...ticket, status: 'On Que' };
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
        <div className='container-agent'>
            {['On Que', 'Serving', 'Done', 'Cancelled'].map((section) => (
                <div className="section" key={section}>
                    <h2>{section}</h2>
                    {tickets.filter(ticket => ticket.status === section).map(ticket => (
                        <div className='card' key={ticket.id}>
                            <div className='card-description'>
                                <p># Ticket NO {ticket.ticketNumber}</p>
                            </div>
                            <div className="card-button">
                                {section === 'Cancelled' ? (
                                    <button className='button-group' onClick={() => handleAction(ticket.id, 'Reinstate')}>Reinstate</button>
                                ) : (
                                    <button className='button-group' onClick={() => handleAction(ticket.id, 'Cancel')}>Cancel</button>
                                )}
                                {ticket.status === 'On Que' && (
                                    <button className='button-group' onClick={() => handleAction(ticket.id, 'Serve')}>Serve</button>
                                )}
                                {section === 'Done' && (
                                    <button className='button-group' onClick={() => handleReview(ticket.ticketNumber)}>Review</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Agent;
