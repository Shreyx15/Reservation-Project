import { useContext, useState } from 'react';
import useFetch from '../../hooks/fetchData';
import './myBookings.css';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Grid } from '@mui/material';
import React from 'react';
import GradientCircularProgress from '../../components/GradientCircularProgress/GradientCircularProgress';
import SearchItem from '../../components/searchItem/SearchItem';
import Navbar from '../../components/Navbar/Navbar';
import BookedHotel from '../../components/BookedHotel/BookedHotel';

const MyBookings = () => {
    const { user: userFromAuth } = useContext(AuthContext);
    const { data, loading, error } = useFetch(`/users/bookings/getUserBookings/${userFromAuth?._id}`);


    console.log("data from the server side is: ", JSON.stringify(data));

    return (
        <div>
            <Navbar />
            <div className="bookingsContainer">
                <Grid container className='myBooking-grid' flexDirection="column" gap={1}>
                    {loading ? <GradientCircularProgress /> :
                        data?.map((ele) => {
                            return <BookedHotel data={ele} />
                        })
                    }
                </Grid>
            </div>
        </div>
    );
};

export default MyBookings;