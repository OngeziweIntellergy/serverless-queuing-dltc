// SidePanel.js
import React from 'react';
import './SidePanel.css';
import { useNavigate } from "react-router-dom";
import { resetUserSession } from '../../service/AuthService';

function SidePanel() {
  const navigate = useNavigate();
  const handleLogout=()=>{
    resetUserSession();
    navigate('/login')

  }
  
  return (
    <div className="side-panel">
      <div className="side-panel-item" onClick={navigate("/dashboard")}>Home</div>
      <div className="side-panel-item" onClick={navigate("/dashboard")}>Ticketing</div>
      <div className="side-panel-item" onClick={navigate("/user")}>Users</div>
      <div className="side-panel-item" onClick={handleLogout}>Logout</div>
    </div>
  );
}

export default SidePanel;
