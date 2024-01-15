import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BarChart from '../../components/barchart/BarChart';
import { BsFillPersonCheckFill, BsGraphUp, BsClockHistory, BsPeople, BsBarChartLine } from 'react-icons/bs';

export const UserData = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
    userLost: 823,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
    userLost: 345,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
    userLost: 555,
  },
  {
    id: 4,
    year: 2019,
    userGain: 90000,
    userLost: 4555,
  },
  {
    id: 5,
    year: 2020,
    userGain: 4300,
    userLost: 234,
  },
];

function Dashboard() {
  const [agentsActive, setAgentsActive] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [averageHandleTime, setAverageHandleTime] = useState(0);
  const [firstContactResolutionRate, setFirstContactResolutionRate] = useState(0);
  const [customerSatisfaction, setCustomerSatisfaction] = useState(0);
  const [queueInfo, setQueueInfo] = useState({ length: 0, waitTime: 0 });

  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });


  // You would replace the '0' in the JSX with the actual state variables
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>SUPERUSER DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>Agents Active</h3>
            <BsFillPersonCheckFill className='card_icon'/>
          </div>
          <h1>{agentsActive}</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>Total Tickets Served</h3>
            <BsGraphUp className='card_icon'/>
          </div>
          <h1>{totalTickets}</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>Average Handling Time</h3>
            <BsClockHistory className='card_icon'/>
          </div>
          <h1>{averageHandleTime} min</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>First Contact Resolution</h3>
            <BsPeople className='card_icon'/>
          </div>
          <h1>{firstContactResolutionRate}%</h1>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>Customer Satisfaction</h3>
            <BsBarChartLine className='card_icon'/>
          </div>
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>Queue Info</h3>
            {/* You can use other icons or visual representations */}
          </div>
          <div className='queue-details'>
            <p>Length: {queueInfo.length}</p>
            <p>Avg Wait: {queueInfo.waitTime} min</p>
          </div>
        </div>
      </div>
      <div style={{ width: 700 }}>
        <BarChart chartData={userData} />
      </div>
    </main>
  );
}

export default Dashboard;
