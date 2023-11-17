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
        window.location.href = 'https://dltc-login.auth.us-east-1.amazoncognito.com/login?client_id=546ingr1kv2p9r9mfcot8v321i&response_type=code&scope=openid&redirect_uri=https%3A%2F%2Ffrontend.d17g06z7kjqaor.amplifyapp.com%2Fagent';
    };
    

// const handleAction = (id, action) => {
//     // Function to actually cancel the ticket
//     const cancelTicket = () => {
//         let updatedTickets = tickets.map(ticket => {
//             if (ticket.id === id && action === 'Cancel') {
//                 return { ...ticket, state: 'Cancel' };
//             }
//             return ticket;
//         });
//         setTickets(updatedTickets);
//     };

//     // If Cancel is clicked on a ticket in the Serving lane
//     if (action === 'Cancel') {
//         const ticketToCancel = tickets.find(ticket => ticket.id === id);
//         if (ticketToCancel && ticketToCancel.state === 'Serving') {
//             Swal.fire({
//                 title: 'Cancel Ticket',
//                 text: 'Select a reason for cancellation:',
//                 input: 'select',
//                 inputOptions: {
//                     Delayed: 'Delayed',
//                     Missing : 'Missing Documents',
//                     Bathroom : 'Bathroom Break',
//                     other: 'Other'
//                 },
//                 inputPlaceholder: 'Select a reason',
//                 showCancelButton: true
//             }).then((result) => {
//                 if (result.value) {
//                     cancelTicket();
//                 }
//             });
//         } else {
//             cancelTicket();
//         }
//     } else {
//         let updatedTickets = tickets.map(ticket => {
//             // If a ticket is being served, move the currently serving ticket to done
//             if (action === 'Serve' && ticket.state === 'Serving') {
//                 return { ...ticket, state: 'Done' };
//             }
    
//             if (ticket.id === id) {
//                 switch (action) {
//                     case 'Cancel':
//                         return { ...ticket, state: 'Cancel' };
//                     case 'Serve':
//                         return { ...ticket, state: 'Serving' };
//                     case 'Done':
//                         return { ...ticket, state: 'Done' };
//                     case 'Reinstate':
//                         return { ...ticket, state: 'in Queue' };
//                     default:
//                         return ticket;
//                 }
//             }
//             return ticket;
//         });
    
//         setTickets(updatedTickets);
//     }
// };

// const handleAction = async (id, action) => {
//     // const axiosInstance = axios.create({
//     //     baseURL: 'https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev',
//     //     headers: {
//     //       'Content-Type': 'application/json'
          
//     //     }
//     //   });
//     // Function to update ticket state in the database
//     const updateTicketState = async (newState) => {
//         console.log(newState)
//         // console.log(state)
//         try {
//             const response = await axios.post('https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket', {
//                 ticket_id: id,
//                 state: newState
//             });

//             if (response.status === 200) {
//                 // Update the local state if the database update is successful
//                 let updatedTickets = tickets.map(ticket => {
//                     if (ticket.id === id) {
//                         return { ...ticket, state: newState };
//                     }
//                     return ticket;
//                 });
//                 setTickets(updatedTickets);

//                 // Show success message
//                 Swal.fire('Success', 'Ticket state updated successfully', 'success');
//             } else {
//                 // Handle any other response status
//                 Swal.fire('Error', 'Failed to update ticket state', 'error');
//             }
//         } catch (error) {
//             // Handle network or server errors
//             console.error('Error updating ticket state:', error);
//             Swal.fire('Error', 'Network or server error', 'error');
//         }
//     };

    // Determine the new state based on the action and current state
    let newState = '';
    switch (action) {
        case 'Cancel':
            newState = 'Cancel';
            break;
        case 'Serve':
            newState = 'Serving';
            break;
        case 'Done':
            newState = 'Done';
            break;
        case 'Reinstate':
            newState = 'in Queue';
            break;
        default:
            return;
    }

    // Call function to update the state in the database
    updateTicketState(newState);
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
