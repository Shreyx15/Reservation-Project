import React, { useEffect } from 'react';
import "./HotelsTable.scss";
import useFetch from '../../../hooks/useFetch';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

const HotelsTable = () => {
    const { data } = useFetch("/hotels/getAllHotels");
    console.log(data);


    const handleDelete = async (hotelId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const res = await axios.delete(`/hotels/${hotelId}`);
            console.log(res.status);

            Swal.fire(
                'Deleted!',
                'The Hotel has been deleted.',
                'success'
            ).then(() => {
                window.location.reload();
            });
        }

    }


    return (
        <Grid container justifyContent="center">
            <Grid item xs={10} sm={12} md={12} lg={10}>
                <table id="hotelsTable" className="hotels-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>City</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((hotel, index) => (
                            <>
                                <tr className='hrRow'>
                                    <td colSpan="6">
                                        <hr className='hr' />
                                    </td>
                                </tr>
                                <tr key={hotel._id}>
                                    <td className='tableCell'>{index + 1}</td>
                                    <td className='tableCell'><img src={hotel.photos[0]} id='image' alt="No user image" /></td>
                                    <td className='tableCell'>{hotel.name}</td>
                                    <td className='tableCell'>{hotel.type}</td>
                                    <td className='tableCell'>{hotel.city}</td>

                                    <td className='btnCell'>
                                        <div className='table-btnContainer'>
                                            <Link to={`/hotels/${hotel._id}`} className='linktoSingleHotel'>
                                                <Button variant="contained" color="primary" className='actionBtn'>
                                                    View
                                                </Button>
                                            </Link>
                                            <Button variant="contained" color="primary" className="actionBtn" onClick={() => { handleDelete(hotel._id) }}>
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

export default HotelsTable;