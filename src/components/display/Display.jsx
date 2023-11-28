import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Display.css';

const Display = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState({ serving: [], queue: [] });

  useEffect(() => {
    setIsLoading(true);
    const fetchOptions = async () => {
      try {
        const result = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
        
        const servingTasks = result.data.filter(task => task.state === 'Serving');
        const queueTasks = result.data.filter(task => task.state === 'in Queue');
        
        setTasks({ serving: servingTasks, queue: queueTasks });
        console.log()
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, [tasks]);

  const columns = [
    { name: 'prdb', title: 'Operating Licence' },
    { name: 'learners', title: 'Motor Vehicle License' },
    { name: 'motoCycleVehicle', title: 'Professional Driving Permit' },
    { name: 'driversLicence', title: 'Driver Renewal Licence' },
  ];

  return (
    <>
      <header className="headerDisplay fixed-top text-white text-center p-1">
          <h1>SMART DLTC</h1>
      </header>
      <div className="container-fluid">
          <div className="row justify-content-center">
              {columns.map((column) => (
                  <KanbanColumn 
                      key={column.name} 
                      column={column} 
                      servingTasks={tasks.serving.filter(task => task.option === column.title)}
                      queueTasks={tasks.queue.filter(task => task.option === column.title)}
                  />
              ))}
          </div>
      </div>
    </>
  );
};

const KanbanColumn = ({ column, servingTasks, queueTasks }) => {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="card h-100 glassmorphism">
        <div className="card-header text-white">
          {column.title}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="serving-section mb-3 p-2">
            <h4 className="text-uppercase text-tertiary">Serving</h4>
            {servingTasks.map((task, index) => (
                <KanbanTask key={index} task={task} isServing={true} />
            ))}
          </div>
          <div className="upcoming-section flex-grow-1 p-2">
            <h4 className="text-uppercase text-warning">Upcoming Tickets</h4>
            {queueTasks.map((task, index) => (
                <KanbanTask key={index} task={task} isServing={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanTask = ({ task, isServing }) => {
  return (
    <div className={`card mb-2 ${isServing ? "serving-task" : "upcoming-task"}`}>
      <div className="card-body">
        <div className="d-flex justify-content-center align-items-center ticket-color">
          <p className="ticket-number badge badge-pill badge-success">
            <span className='color-change'>{task.ticket_number}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Display;