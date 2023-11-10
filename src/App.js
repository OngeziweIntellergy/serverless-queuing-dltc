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
      <Reason/>
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
