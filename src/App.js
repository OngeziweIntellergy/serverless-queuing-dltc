import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Agent from './pages/agent/Agent';
import Reason from './pages/reason/Reason';
import Ticket from './pages/ticket/Ticket';
import Login from './pages/login/Login';
import User from './pages/user/user';
import Register from './pages/register/Register';
import WaitingArea from './pages/waitingarea/WaitingArea';
import NotFound from './pages/notfound/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<WaitingArea />} />
          <Route path="/WaitingArea" element={<WaitingArea />} />
          <Route path="/reason" element={<Reason />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/user" element={<User />} />
          <Route path="*" element={<NotFound />} /> 
         
        </Routes>
      </div>
    </Router>
        
  );
}

export default App;
