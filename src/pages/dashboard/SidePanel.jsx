// SidePanel.js
import React from 'react';
import './SidePanel.css';

function SidePanel() {
  return (
    <div className="side-panel">
      {/* Add your side panel content here */}
      <div className="side-panel-item">Home</div>
      <div className="side-panel-item">Products</div>
      <div className="side-panel-item">Users</div>
      <div className="side-panel-item">Orders</div>
      <div className="side-panel-item">Account</div>
    </div>
  );
}

export default SidePanel;
