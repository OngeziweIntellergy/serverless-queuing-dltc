import React from 'react';

function CounterDisplay({ counters }) {
  return (
    <div className="counter-display">
      <h2>Counters</h2>
      {Object.entries(counters).map(([counterId, customerNumber]) => (
        <div key={counterId}>
          <h3>Counter {counterId}</h3>
          <p>{customerNumber || 'Waiting...'}</p>
        </div>
      ))}
    </div>
  );
}

export default CounterDisplay;