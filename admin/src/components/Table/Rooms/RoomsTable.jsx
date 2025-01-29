import React, { useContext, useEffect, useState } from 'react';
import "./RoomsTable.scss";
import useFetch from '../../../hooks/useFetch';
import { Button, Checkbox } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { hotelRoomContext } from '../../../context/hotelRoomContext';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';

const RoomsTable = () => {

    const { data, loading, error } = useFetch("/rooms");
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [hotelNames, setHotelNames] = useState([]);
    const { dataState, dispatch } = useContext(hotelRoomContext);

    useEffect(() => {
        const getHotelNames = async () => {
            const names = [];
            for (const room of data) {
                if (room.associatedHotel === undefined || room.associatedHotel === null) {
                    names.push("No Hotel Assigned");
                    continue;
                }
                try {
                    const hotel = await axios.get(`${process.env.BACKEND_HOSTED_URL}/hotels/find/${room.associatedHotel}`);
                    names.push(hotel.data.name);
                } catch (error) {
                    console.error(error);
                    names.push("Error fetching Hotel Name!");
                }
            }
            setHotelNames(names);
        };

        getHotelNames();
    }, [data]);

    const handleCheckboxClick = (e, id) => {
        const isChecked = e.target.checked;

        let roomsToBeUpdated = dataState.selectedRooms;
        if (isChecked) {
            roomsToBeUpdated.push(id);
        } else {
            roomsToBeUpdated = roomsToBeUpdated.filter(roomId => roomId !== id);
        }

        const action = {
            type: "setSelectedRooms",
            roomsToBeUpdated
        };

        dispatch(action);
        // console.log(roomsToBeUpdated);
    }

    // const handleButtonClick = () => {

    //     const action = {
    //         type: "setSelectedRooms",
    //         roomsToBeUpdated: selectedRooms
    //     };

    //     dispatch(action);
    //     console.log(dataState.selectedRooms);

    // }
    const handleRoomDelete = async (roomId) => {

        const response = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            text: 'You are about to delete this Room data!',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (response.isConfirmed) {
            try {
                const res = await axios.get(`${process.env.BACKEND_HOSTED_URL}/rooms/${roomId}`);

                if (res.status === 200 || Math.floor(res.status / 100) === 2) {
                    Swal.fire(
                        'Deleted!',
                        'The Room has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (

        <table id="roomsTable" className="rooms-table">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Associated Hotel</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((room, index) => (
                    <>
                        <tr className='hrRow' key={index}>
                            <td colSpan="6">
                                <hr className='hr' />
                            </td>
                        </tr>
                        <tr key={room._id}>
                            <td className='tableCell'><Checkbox onClick={(e) => { handleCheckboxClick(e, room?._id) }} disabled={hotelNames[index] !== "No Hotel Assigned"} /></td>
                            <td className='tableCell'><img src={room?.img} id='image' alt="No Room image" /></td>
                            <td className='tableCell'>{room?.title}</td>
                            <td className='tableCell hotelNameCell'>{hotelNames[index]}</td>
                            <td className='btnCell'>
                                <div className='table-btnContainer'>
                                    <Link to={`/rooms/${room?._id}`} className='linkToSingleRoom'>
                                        <Button variant="contained" color="primary" className='actionBtn'>
                                            View
                                        </Button>
                                    </Link>
                                    <Button variant="contained" color="primary" className="actionBtn" onClick={() => { handleRoomDelete(room._id) }}>
                                        <DeleteIcon id="deleteIcon" />
                                    </Button>
                                </div>
                            </td>
                        </tr>

                    </>
                ))}
            </tbody>
        </table>


    );
};

export default RoomsTable;