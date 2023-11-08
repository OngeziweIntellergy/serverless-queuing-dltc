import React from 'react';

function QueueDisplay({ queue }) {
  return (
    <div className="queue-display">
      <h2>Queue</h2>
      <ul>
        {queue.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
    </div>
  );
}

export default QueueDisplay;