import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Display.css'; // ensure you create a CSS file with this name

const Display = () => {
    const tasks = {
        prdb: [
          { id: 1, title: 'Ticket', labels: ['Web Design', 'UI Design'], consultant: 'John Doe', station: 'A1' },
          { id: 2, title: 'Ticket ', labels: ['App design', 'UI Research'], consultant: 'John Doe', station: 'A1' },
          { id: 3, title: 'Ticket ', labels: ['Web Design', 'UI Design'], consultant: 'John Doe', station: 'A1' },
        ],
        motoCycleVehicle: [
          { id: 4, title: 'Ticket ', labels: ['App design', 'UI Research'], consultant: 'John Doe', station: 'A1' },
          { id: 5, title: 'Ticket ', labels: ['Dashboard', 'UI Design'], consultant: 'John Doe', station: 'A1' },
        ],
        learners: [
          { id: 6, title: 'Ticket ', labels: ['App design', 'UI Research'], consultant: 'John Doe', station: 'A1' },
          { id: 7, title: 'Ticket ', labels: ['Web Design', 'UI Design'], consultant: 'John Doe', station: 'A1' },
          { id: 8, title: 'Ticket ', labels: ['Dashboard', 'UI Design'], consultant: 'John Doe', station: 'A1' },
        ],
        driversLicence: [
          { id: 9, title: 'Ticket ', labels: ['Web Design', 'UI Design'], consultant: 'John Doe', station: 'A1' },
          { id: 10, title: 'Ticket ', labels: ['App design', 'UI Research'], consultant: 'John Doe', station: 'A1' },
        ],
      };
      const columns = [
        { name: 'prdb', title: 'Transport Operating Licencing Administration Board' },
        { name: 'motoCycleVehicle', title: 'Proffessional Driving Permit' },
        { name: 'learners', title: 'Motor Vehicle Licence' },
        { name: 'driversLicence', title: 'Driver Renewal Licence' },
      ];

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {columns.map((column) => (
          <KanbanColumn key={column.name} column={column} tasks={tasks[column.name]} />
        ))}
      </div>
    </div>
  );
};

const KanbanColumn = ({ column, tasks }) => {
  // Serving takes the first task, Upcoming takes the next six
  const servingTask = tasks.slice(0, 1);
  const upcomingTasks = tasks.slice(1, 7);

  return (
    <>
    <header className="fixed-top bg-primary text-white text-center p-3">
        <h1>DLTC </h1>
      </header>
    
    <div className="col-md-6 col-lg-3 mb-4"> {/* Adjusted for better responsive behavior */}
      <div className="card h-100">
        <div className="card-header bg-primary text-white">
          {column.title}
        </div>
        <div className="card-body">
          <div className="serving-section">
            <h6 className="text-uppercase text-secondary">Serving</h6>
            {servingTask.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </div>
          <div className="upcoming-section mt-3">
            <h6 className="text-uppercase text-secondary">Upcoming Tickets</h6>
            {upcomingTasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const KanbanTask = ({ task }) => {
    return (
      <div className="card mb-2">
        <div className="card-body text-center">
          <div className="d-flex justify-content-center align-items-center">
            <h5 className="card-title font-weight-bolder mb-0">{task.title}</h5>
            <span className="ticket-number font-weight-bolder ml-2">#{task.id}</span>
          </div>
         
          <div className="consultant-station mt-2">
            <span className="font-weight-bold text-dark">Consultant: {task.consultant}</span><br/>
            <span className="font-weight-bold text-dark">Station: {task.station}</span>
          </div>
        </div>
      </div>
    );
  };
  
  



export default Display;
