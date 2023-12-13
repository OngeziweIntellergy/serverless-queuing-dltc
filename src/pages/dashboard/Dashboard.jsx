// Dashboard.js
import React from 'react';
import './Dashboard.css';
import Card from './Card';
import SidePanel from './SidePanel';
function Dashboard() {
  return (
    <div className="dashboard-container"> {/* Wrap content in a new container */}
      <SidePanel /> 
      <div className="dashboard">
        <div className="dashboard-header">
          Welcome back to DLTC
        </div>
        <div className="dashboard-cards">
          <Card title="Products" number={5} />
          <Card title="Users" number={5} />
          <Card title="Orders" number={5} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
