import logo from './logo.svg';
import './App.css';
import Agent from './components/agent/Agent';
import Display from './components/display/Display';
import React from 'react';
import ReactDOM from 'react-dom';
import Reason from './components/reason/Reason';


function App() {
  return (
    <main className="App">
      <Display/>
      <img src="https://dltccoffeeimages.s3.amazonaws.com/Gauteng+transport.jpeg"></img>
      <h1>Please register to start</h1>
      <Login />
      <Agent/>
      
    </main> 
  );
}

export default App;

// ReactDOM.render(
//   <React.StrictMode>
//     <Reason/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
