import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Agent from './pages/agent/Agent';
import Display from './pages/display/Display';
import Reason from './pages/reason/Reason';
import Ticket from './pages/ticket/Ticket';
import Login from './pages/login/Login';
import User from './pages/user/user';


function App() {
  return (
    <Router>
      <div className="App">
        {/* <nav>
          <Link to="/">Home</Link>
          <Link to="/reason">Reason</Link>
          <Link to="/agent">Agent</Link>
        </nav> */}

        {/* New API in react-router-dom v6: 'Routes' replaces 'Switch' */}
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/reason" element={<Reason />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<Display />} /> 
        </Routes>
      </div>
    </Router>

        

  );
}

export default App;