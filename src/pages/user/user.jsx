import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Swal from 'sweetalert2';
import './user.css';

export default function User() {
  const [rows, setRows] = useState([]);

  const fetchUserList = async () => {
    try {
      const response = await axios.post(
        'https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/List'
      );
      const { statusCode, body } = response.data;

      if (statusCode === 200) {
        const jsonObject = JSON.parse(body);
        const transformedRows = jsonObject.map((item, index) => ({
          id: index + 1,
          ...item,
        }));
        setRows(transformedRows);
      } else {
        console.error('Error fetching user list');
      }
    } catch (error) {
      console.error('Error fetching user list', error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleLogoff = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New User',
      html:
        '<input id="username" class="swal2-input" placeholder="Username">' +
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="UserRole" class="swal2-input" value="user" hidden>' +
        '<input id="password" class="swal2-input" placeholder="Password">' +
        '<input id="station" class="swal2-input" placeholder="Station">',
      confirmButtonText: 'Add User',
      focusConfirm: false,
      preConfirm: () => {
        const user = {
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          station: document.getElementById('station').value,
          UserRole: document.getElementById('UserRole').value
        };
        return user;
      },
    });

    if (formValues) {
      try {
        const apiEndpoint = 'https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/register';
        const response = await axios.post(apiEndpoint, formValues);
        
        if (response.status === 200) {
          Swal.fire('Success', 'User added successfully', 'success');
          fetchUserList();
        } else {
          Swal.fire('Oops...', `User could not be added. Status code: ${response.status}`, 'error');
        }
      } catch (error) {
        if (error.response) {
          Swal.fire('Error', `Server responded with status code: ${error.response.status}`, 'error');
        } else if (error.request) {
          Swal.fire('Error', 'No response received from the server', 'error');
        } else {
          Swal.fire('Error', `Error in setting up the request: ${error.message}`, 'error');
        }
        console.error('Request failed:', error.config);
      }
    }
  };

  // ...

const handleDeleteUser = async (userId) => {
  const result = await Swal.fire({
    title: 'Delete User',
    text: 'Are you sure you want to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      // Assuming the id in your rows state matches the user_id in DynamoDB
      const userToDelete = rows.find((row) => row.id === userId);

      // Make sure we have a valid user ID to delete
      if (!userToDelete || !userToDelete.user_id) {
        throw new Error('User ID to delete is invalid or missing');
      }

      const response = await axios.delete(
        'https://fdau2rqk41.execute-api.us-east-1.amazonaws.com/Prod/delete',
        {
          data: {
            user_id: userToDelete.user_id,
          },
        }
      );

      if (response.status === 200) {
        // Create a new array without the deleted user
        const updatedRows = rows.filter((row) => row.user_id !== userToDelete.user_id);
        // Update the state with the new array to re-render the component
        setRows(updatedRows);
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } else {
        Swal.fire('Error', 'Could not delete user', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Request failed: ' + error.message, 'error');
    }
  }
};

// ...


  const columns = [
    { field: 'id', headerName: 'Number', width: 250 },
    { field: 'username', headerName: 'Username', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'UserRole', headerName: 'User Role', width: 250 },
    { field: 'station', headerName: 'Station', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleDeleteUser(params.row.id)}>Delete</button>
        </div>
      ),
    },
    // ... other columns
  ];

  return (
    <div className="data-grid-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginRight: '30px' }}>
        {/* Logoff Button */}
        <button onClick={handleLogoff} className="Signout-button">
          Signout
        </button>
        {/* Add User Button */}
        <button onClick={handleAddUser} className="add-user-button">
          Add User
        </button>
      </div>
      <DataGrid
        className="data-grid"
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        pagination
      />
    </div>
  );
}