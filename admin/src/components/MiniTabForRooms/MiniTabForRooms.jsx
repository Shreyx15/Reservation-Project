import React, { useContext, useEffect, useState } from 'react';
import { hotelRoomContext } from '../../context/hotelRoomContext';
import useFetch from '../../hooks/useFetch';
import "./MiniTabForRooms.scss";
import axios from 'axios';
import { Button, Card, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const MiniTabForRooms = () => {
    const { dataState, dispatch } = useContext(hotelRoomContext);
    const { data: hotels } = useFetch("/hotels/getAllHotels");
    const [hotelId, setHotelId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [roomNumber, setRoomNumber] = useState(undefined);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const selectedRoomIds = dataState.selectedRooms;
                const response = await axios.post(`${process.env.BACKEND_HOSTED_URL}/rooms/get_selected_rooms`, { data: selectedRoomIds });
                setRooms(response.data);
                if (rooms.length > 0) {
                    const action = {
                        type: 'setSelectedRooms',
                        roomsToBeUpdated: []
                    };

                    dispatch(action);
                }
            } catch (error) {
                console.error("Error fetching selected rooms:", error);
            }
        };

        fetchData();
        //dataState.hotelId
    }, [dataState.hotelId]);



    const handleUpdates = async () => {
        if (dataState.miniTab === "selectHotel") {
            console.log(hotelId);
            dispatch({ type: "setHotelId", hotelId: hotelId, miniTab: "rooms" });

        } else if (dataState.miniTab === "rooms") {
            // const action = {
            //     type: "setSelectedRooms",
            //     roomsToBeUpdated: roomData
            // };

            // dispatch(action);
            // setFinishState(true);

            const response = await Swal.fire({
                icon: 'warning',
                title: 'Confirm Room Data Update',
                text: 'Are you sure you want to update the room data?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Update it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            });

            if (response.isConfirmed) {
                const dataToBeSent = {
                    hotelId: dataState.hotelId,
                    roomData: dataState.selectedRooms
                };
                console.log(dataToBeSent.roomData);
                const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/rooms/assignHotel`, { data: dataToBeSent });

                if (res.status === 200 || Math.floor(res.status / 100) === 2) {
                    Swal.fire({
                        title: '<p>Room Data Updated</p>',
                        confirmButtonText: "OK"
                    }).then((res) => {
                        if (res.isConfirmed) {
                            dispatch({ type: "roomUpdateFinished" });
                            window.location.reload();
                        }
                    });
                }
            }
        }
    }
    // console.log(dataState);

    const handleAddButtonClick = (roomId, inputId) => {
        const roomNumberInput = document.getElementById(inputId);

        if (roomNumberInput) {
            const roomNumber = Number(roomNumberInput.value);
            const curr_room_data = dataState.selectedRooms;

            const action = {
                type: "setSelectedRooms",
            };

            if (curr_room_data.length === 0) {
                action.roomsToBeUpdated = [{ id: roomId, roomNumbers: [roomNumber] }];
                dispatch(action);
                return;
            }

            const updatedRoomData = curr_room_data.map((room) =>
                room.id === roomId ? {
                    ...room, roomNumbers: [...room.roomNumbers, roomNumber]
                } : room
            );

            action.roomsToBeUpdated = updatedRoomData;
            dispatch(action);
        }
    }


    return (
        <Grid container className='miniTabContainer' justifyContent="center">

            <Grid item xs={12} sm={10} md={4} lg={4} className='miniTab'>
                <div className="titleText">{dataState.miniTab === 'selectHotel' ? "Select a Hotel" : "Add Room Numbers"}</div>
                <div className={`miniTabContent ${dataState.miniTab === 'rooms' ? 'roomsActive' : ''}`}>

                    {dataState.miniTab === "selectHotel" && (
                        <>
                            {
                                hotels.map((hotel) => {
                                    return (
                                        <div className={`listItemHotel ${hotelId === hotel._id ? 'selected' : ""}`} onClick={() => { setHotelId(hotel._id) }}>
                                            <div className="hotelImg">
                                                <img src={hotel.photos[0]} alt="No hotel image" className="hotelImg" />
                                            </div>
                                            <div className="hotelInfo">
                                                <div className="hotelName">
                                                    {hotel.name}
                                                </div>
                                                <div className="hotelLocation">
                                                    {hotel.city}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </>

                    )
                    }
                    {
                        dataState.miniTab === "rooms" && (
                            <>
                                {
                                    rooms.map((room, index) => {
                                        return (
                                            <div className="roomContainer">
                                                <div className="roomImgContainer">
                                                    <img src={room.img} alt="" className="roomImg" />
                                                </div>
                                                <div className="roomTitle">
                                                    {room.title}
                                                </div>
                                                <div className="addNumberField">
                                                    <TextField
                                                        label="Room Numbers"
                                                        type="number"
                                                        name="roomNumber"
                                                        margin="normal"
                                                        className='roomNumberFieldInput'
                                                        id={`roomNumber_${index}`}
                                                        fullWidth
                                                        required
                                                    />
                                                    <AddCircleIcon className="addIconButton" onClick={() => { handleAddButtonClick(room._id, `roomNumber_${index}`) }} />
                                                </div>
                                            </div>
                                        );
                                    })

                                }

                            </>
                        )
                    }
                </div>
                <div className="actionBtn">
                    <Button type="button" variant='contained' className='nextFinBtn' color="primary" onClick={handleUpdates}>
                        {dataState.miniTab === "selectHotel" ? 'Next' : 'Finish'}
                    </Button>
                </div>

            </Grid>
        </Grid>

    );
};

export default MiniTabForRooms;