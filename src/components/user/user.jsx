import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './user.css';
import Swal from 'sweetalert2';

const columns = [
  { field: 'id', headerName: 'Number', width: 250 },
  { field: 'username', headerName: 'Username', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'User_Role', headerName: 'User Role', width: 250 },
  { field: 'station', headerName: 'Station', width: 250 },
  // ... other columns
];

export default function User() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
          try {
            const result = await axios.post('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/List');
            const respData = result.data.statusCode;
            const resp = result.data.body;
            
            if (respData === 200) {
                const jsonObject = JSON.parse(resp);
                const transformedRows = jsonObject.map((item, index) => ({
                    id: index + 1, // Assuming you don't have a unique 'id' field in your data
                    ...item
                }));
                setRows(transformedRows);
            } else {
                // Handle non-successful response
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchOptions();
    }, []);

    const handleAddUser = () => {
        Swal.fire({
            title: 'Add New User',
            html:
                '<input id="username" class="swal2-input" placeholder="Username">' +
                '<input id="email" class="swal2-input" placeholder="Email">' +
                '<input id="password" class="swal2-input" placeholder="Password">' +
                '<input id="User Role" class="swal2-input" placeholder="User Role">' +
                '<input id="station" class="swal2-input" placeholder="Station">',
            confirmButtonText: 'Add User',
            focusConfirm: false,
            preConfirm: () => {
                const user = {
                    // username: "hjsdfiv",
                    // email:"hjgsuidfhi",
                    // user_Role: "kijvd",
                    // station:"4"
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    User_Role: document.getElementById('User Role').value,
                    station: document.getElementById('station').value
                };
                // const response =  await fetch('https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/register', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',                    
                //     },
                //     body: JSON.stringify(user),
                // });
    
                // Replace with your API endpoint
                const apiEndpoint = 'https://op0unjbx79.execute-api.us-east-1.amazonaws.com/Dev/register';
    
                // // Make POST request to add the user
                axios.post(apiEndpoint,user).then(response => {
                        // console.log(JSON.parse(response))
                        // console.log(JSON.parse(response.data))
                        console.log(response)

                        // Handle the response here. Example:
                        if(response.status){
                            Swal.fire(response.data);
                            window.location.reload(false);
                            
                        } else {
                            Swal.fire('Error', 'Could not add user', 'error');
                        }
                    })
                    .catch(error => {
                        // Handle errors here
                        Swal.fire('Error', 'Request failed: ' + error.message, 'error');
                    });
            }
        });
    };
    

    return (
        <div className="data-grid-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginRight: '30px'  }}>
                <button onClick={handleAddUser} className="add-user-button">Add User</button>
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

    {/* // return (
    //     <div style={{ height: 400, width: '100%' }}>
            
    //         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginRight: '30px' }}>
    //         <button onClick={handleAddUser} style={{ padding: '10px', fontSize: '16px' }}>Add User</button>
    //         </div>
    //         <DataGrid
    //             rows={rows}
    //             columns={columns}
    //             pageSize={5}
    //             checkboxSelection
    //             pagination
    //         />
    //     </div>
    // ); */}
}
