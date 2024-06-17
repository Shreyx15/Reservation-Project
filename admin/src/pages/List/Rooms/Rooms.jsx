import React, { useContext, useState } from 'react';
import DrawerMUI from '../../../components/Sidebar/DrawerMUI';
import Navbar from '../../../components/Navbar/Navbar';
import { Button, Container } from '@mui/material';
import "./Room.scss";
import { themeContext } from '../../../context/themeContext';
import useFetch from '../../../hooks/useFetch';
import RoomsTable from '../../../components/Table/Rooms/RoomsTable';
import { HotelRoomContextProvider, hotelRoomContext } from '../../../context/hotelRoomContext';
import MiniTabForRooms from '../../../components/MiniTabForRooms/MiniTabForRooms';
import CommonLayout from "../../../components/CommonLayout/CommonLayout";
import Grid from "@mui/material/Grid";
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const Rooms = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const { state } = useContext(themeContext);
    const { dataState, dispatch } = useContext(hotelRoomContext);

    const handleMiniTabOpen = () => {
        const action = {
            type: 'selectHotel'
        };

        dispatch(action);
    }

    return (
        <>
            {
                isLoggedIn ? (
                    <CommonLayout>
                        <Grid container justifyContent="center">
                            <Grid item xs={10} sm={12} md={12} lg={10} className='rooms-container'>
                                <Button type="button" color="primary" variant='contained' className='assign-btn' onClick={handleMiniTabOpen}>Assign Hotels</Button>
                                <RoomsTable />
                                {(dataState.miniTab !== "") && (
                                    <MiniTabForRooms />

                                )}
                            </Grid>
                        </Grid>
                    </CommonLayout>
                ) : <div>User Not Logged In!</div>
            }
        </>
    );
};

export default Rooms;

