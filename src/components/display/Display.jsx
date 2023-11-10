import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Display.css'; // ensure you create a CSS file with this name

const Display = () => {
    const tasks = {
        prdb: [
          { id: 1, title: 'Ticket', labels: ['Web Design', 'UI Design'], Agent: 'John Doe', station: 'A1' },
          { id: 2, title: 'Ticket ', labels: ['App design', 'UI Research'], Agent: 'John Doe', station: 'A1' },
          { id: 3, title: 'Ticket ', labels: ['Web Design', 'UI Design'], Agent: 'John Doe', station: 'A1' },
        ],
        motoCycleVehicle: [
          { id: 4, title: 'Ticket ', labels: ['App design', 'UI Research'], Agent: 'John Doe', station: 'A1' },
          { id: 5, title: 'Ticket ', labels: ['Dashboard', 'UI Design'], Agent: 'John Doe', station: 'A1' },
        ],
        learners: [
          { id: 6, title: 'Ticket ', labels: ['App design', 'UI Research'], Agent: 'John Doe', station: 'A1' },
          { id: 7, title: 'Ticket ', labels: ['Web Design', 'UI Design'], Agent: 'John Doe', station: 'A1' },
          { id: 8, title: 'Ticket ', labels: ['Dashboard', 'UI Design'], Agent: 'John Doe', station: 'A1' },
        ],
        driversLicence: [
          { id: 9, title: 'Ticket ', labels: ['Web Design', 'UI Design'], Agent: 'John Doe', station: 'A1' },
          { id: 10, title: 'Ticket ', labels: ['App design', 'UI Research'], Agent: 'John Doe', station: 'A1' },
        ],
      };
      const columns = [
        { name: 'prdb', title: ' Operating Licence ' },
        { name: 'motoCycleVehicle', title: 'Professional Driving Permit' },
        { name: 'learners', title: 'Motor Vehicle Licence' },
        { name: 'driversLicence', title: 'Driver Renewal Licence' },
      ];

  return (
    <>
     <header className=" headerDisplay fixed-top text-white text-center p-3">
        <h1>DLTC</h1>
      </header>
    <div className="container-fluid">
      <div className="row justify-content-center">
        {columns.map((column) => (
          <KanbanColumn key={column.name} column={column} tasks={tasks[column.name]} />
        ))}
      </div>
    </div>
    </>
  );
};

const KanbanColumn = ({ column, tasks }) => {
  // Assuming the first task is the currently serving task
  const servingTask = tasks.slice(0, 1);
  // The next tasks are upcoming
  const upcomingTasks = tasks.slice(1);

  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="card h-100 glassmorphism">
        <div className="card-header text-white" >
          {column.title}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="serving-section mb-3 p-2">
            <h4 className="text-uppercase text-tertiary">Serving</h4>
            {servingTask.map((task) => (
              <KanbanTask key={task.id} task={task} isServing={true} />
            ))}
          </div>
          <div className="upcoming-section flex-grow-1 p-2">
            <h4 className="text-uppercase text-danger">Upcoming Tickets</h4>
            {upcomingTasks.map((task) => (
              <KanbanTask key={task.id} task={task} isServing={false} />
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
      <div className="d-flex justify-content-center align-items-center">
          <p className="ticket-number badge badge-pill badge-success">#{task.id}</p>
      </div>

        <div className="consultant-station mt-2">
            <span className="font-weight-bold text-dark">Agent: {task.Agent}</span><br/>
            <span className="font-weight-bold text-dark">Station: {task.station}</span>
          </div>
      </div>
    </div>
  );
};

export default Display;
