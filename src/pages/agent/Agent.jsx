import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { resetUserSession } from '../../service/AuthService';
import "./Agent.css";


function Agent() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [servedCount, setServedCount] = useState(0);
    const [doneCount, setDoneCount] = useState(0);
    const handleLogout=()=>{
        resetUserSession();
        showLoading()
        navigate('/login')

    }

    // Text-to-Speech Function with Female Voice
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2; // Adjust the rate as needed
    
            const chooseVoice = () => {
                let voices = window.speechSynthesis.getVoices();
                
                // Filter for female voices
                let femaleVoices = voices.filter(voice => voice.name.toLowerCase().includes("female"));
    
                if (femaleVoices.length > 0) {
                    // Choose the first available female voice
                    utterance.voice = femaleVoices[0];
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.warn("No female voice available. Speech synthesis not performed.");
                }
            };
    
            if (window.speechSynthesis.getVoices().length > 0) {
                chooseVoice();
            } else {
                window.speechSynthesis.onvoiceschanged = chooseVoice;
            }
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

                console.log(data);
                
                const processedTickets = data.map(ticket => ({
                    ...ticket,
                    state: ticket.state,  
                    ticketNumber: ticket.ticket_number,
                }));
                setTickets(processedTickets);
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [tickets]);

    useEffect(() => {
        updateCounters();
    }, [tickets]);

    const updateCounters = () => {
        setServedCount(tickets.filter(ticket => ticket.state === 'Serving').length);
        setDoneCount(tickets.filter(ticket => ticket.state === 'Done').length);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const showLoading = function() {
        Swal.fire({
          title: 'Now loading',
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 2000,
          didOpen: () => {
            Swal.showLoading();
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('closed by timer!!!!');
            Swal.fire({ 
              title: 'Finished!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      };

    const handleTicketSelect = (ticket) => {
        Swal.fire({
            title: `Ticket NO ${ticket.ticketNumber}`,
            html: `<strong>Status:</strong> ${ticket.state}<br/><strong>Description:</strong> ${ticket.user}`,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    };

   

    const handleAction = async (ticketNumber, action) => {
        let updatedTickets = [...tickets];
    
        if (action === 'Serving') {
            const currentlyServingTicket = updatedTickets.find(ticket => ticket.state === 'Serving');
    
            if (currentlyServingTicket) {
                updatedTickets = updatedTickets.map(ticket => 
                    ticket.state === 'Serving' ? { ...ticket, state: 'Done' } : ticket
                );
                await updateTicketState('Done', currentlyServingTicket.ticket_number);
            }
    
            updatedTickets = updatedTickets.map(ticket =>
                ticket.ticket_number === ticketNumber ? { ...ticket, state: 'Serving' } : ticket
            );
    
            const ticketBeingServed = updatedTickets.find(ticket => ticket.ticket_number === ticketNumber);
            if (ticketBeingServed) {
                speakText(`Ticket number ${ticketNumber} at station number 1.`);
            }
        } else {
            updatedTickets = updatedTickets.map(ticket => {
                if (ticket.ticket_number === ticketNumber) {
                    return { ...ticket, state: action };
                }
                return ticket;
            });
        }

        setTickets(updatedTickets);
        updateCounters();
        await updateTicketState(action, ticketNumber );
    };

    const updateTicketState = async (newState, ticketNumber) => {
        console.log('Updating ticket state:', newState, 'Ticket number:', ticketNumber);
    
        try {
            const response = await axios.put(`https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket`, {
                ticket_number: ticketNumber,
                state: newState
                
            });
            console.log('Update response:', response);
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

    const filteredTickets = tickets.filter(ticket => ticket.ticketNumber && ticket.ticketNumber.toString().includes(searchQuery));

    return (
        <>
            <div className="sign-out-container">
                <div className='search-section'>
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
                                    key={ticket.ticket_number}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleTicketSelect(ticket)}
                                >
                                    Ticket NO {ticket.ticketNumber}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className='btn-section'>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>
            <h3>Tickets Done: {doneCount}</h3>

            <div className='container-agent mt-4'>
                {['in Queue', 'Serving', 'Done', 'Cancel'].map((section) => (
                    <div key={section} className="section mb-3 lane">
                        <h2>{section}</h2>
                        <div className="d-flex flex-wrap">
                            {tickets.filter(ticket => ticket.state === section).map(ticket => (
                                <div className='card m-2' style={{ width: '18rem' }} key={ticket.ticket_number}>
                                    <div className='card-body'>
                                        <h5 className='card-title'>Ticket NO {ticket.ticketNumber}</h5>
                                        <div className="d-flex justify-content-between">
                                            {section === 'Cancel' ? (
                                                <button className='btn btn-primary' onClick={() => handleAction(ticket.ticket_number, 'in Queue')}>Reinstate</button>
                                            ) : (
                                                <button className='btn btn-danger' onClick={() => handleAction(ticket.ticket_number, 'Cancel')}>Cancel</button>
                                            )}
                                            {ticket.state === 'in Queue' && (
                                                <button className='btn btn-success' onClick={() => handleAction(ticket.ticket_number, 'Serving')}>Serve</button>
                                            )}
                                            {section === 'Done' && (
                                                <button className='btn btn-info' onClick={() => handleReview(ticket.ticket_number)}>Review</button>
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