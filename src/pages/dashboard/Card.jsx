// Card.js
import React from 'react';
import './Card.css';

function Card({ title, number }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-number">{number}</div>
    </div>
  );
}

export default Card;
