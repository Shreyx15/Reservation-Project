import React, { useState } from 'react';
import "./UsersTable.scss";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useFetch from '../../../hooks/useFetch';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import Swal from 'sweetalert2';

const UsersTable = ({ id, user, email }) => {
    const { data } = useFetch("/users/");
    const [userId, setUserId] = useState(null);

    const handleUserDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: 'swalAlert'
        });

        if (result.isConfirmed) {
            const res = await axios.delete(`${process.env.BACKEND_HOSTED_URL}/users/${userId}`);
            console.log(res.status);

            Swal.fire(
                'Deleted!',
                'Your user has been deleted.',
                'success'
            ).then(() => {
                window.location.reload();
            });
        }
    }

    if (userId) {
        handleUserDelete();
        setUserId(null);
    }



    return (
        <Grid container justifyContent="center">
            <Grid item xs={10} sm={12} md={12} lg={10}>
                <table id="usersTable" className="users-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Photo</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => (
                            <>
                                <tr className='hrRow'>
                                    <td colSpan="5">
                                        <hr className='hr' />
                                    </td>
                                </tr>
                                <tr key={user.id}>
                                    <td className='tableCell'>{index + 1}</td>
                                    <td className='tableCell'><img src={user.img} id='image' alt="No user image" /></td>
                                    <td className='tableCell'>{user.username}</td>
                                    <td className='tableCell'>{user.email}</td>
                                    <td className='btnCell'>
                                        <div className='table-btnContainer'>
                                            <Link to={`/users/${user._id}`} className='linkToSingleUser'>
                                                <Button variant="contained" color="primary" className='actionBtn'>
                                                    View
                                                </Button>
                                            </Link>
                                            <Button variant="contained" color="primary" className="actionBtn" onClick={() => setUserId(user._id)}>
                                                <DeleteIcon id="deleteIcon" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                            </>
                        ))}
                    </tbody>
                </table>
            </Grid>
        </Grid>
    );
};


export default UsersTable;