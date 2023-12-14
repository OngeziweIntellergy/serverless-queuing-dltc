
import React from 'react';
import './Dashboard.css';
import Card from './Card';
import { getUser } from '../../service/AuthService';
import SidePanel from './SidePanel';
function Dashboard() {
  let user = getUser();
  console.log(user)
  return (
    <div className="dashboard-container"> 
      <SidePanel /> 
      <div className="dashboard">
        <div className="dashboard-header">
          Welcome back {user.name}
        </div>
        <div className="dashboard-cards">
          <Card title="Tickets Done" number={5} />
          <Card title="Tickets Cancelled" number={5} />
          <Card title="All Tickets" number={5} />
        </div>
      </div>
      <div class='dashboard-info'>
      <div class="profile">
        <img src="/src/assets/img/Gauteng_dltc.jpeg" alt="Profile Avatar" /> 
        <span class="status online"></span> 
      </div>
      <button class="settings">Settings</button>
      <button class="logout">Logout</button>
    </div>

      
    </div>
  );
}

export default Dashboard;
