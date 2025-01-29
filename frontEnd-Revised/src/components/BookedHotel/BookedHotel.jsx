import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import "./bookedHotel.css";

const BookedHotel = ({ data }) => {
    console.log(JSON.stringify(data.rooms));
    const { user } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(false);
    const [showRoomNumbers, setShowRoomNumbers] = useState(false);
    const navigate = useNavigate();

    const toggleRoomNumbers = () => {
        setShowRoomNumbers(!showRoomNumbers);
    };

    const handleCancellation = async (bookingId, userId) => {
        try {

            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'Your Reservation will be Cancelled!',
                icon: 'warning',    
                showCancelButton: true,
                confirmButtonText: 'Okay!',
                cancelButtonText: 'No, cancel!',
            });

            if (confirmation.isConfirmed) {
                const res = await axios.delete(`${process.env.BACKEND_HOSTED_URL}/users/bookings/cancelUserBooking/${userId}/${bookingId}`);
                const { data, status } = res;

                if (status == 200) {
                    Swal.fire({
                        title: "Your reservation has been cancelled!",
                        icon: "success",
                        confirmButtonText: "ok",
                        confirmButtonColor: "#0071c2",
                        width: "max-content",
                    }).then((user_response) => {
                        if (user_response.isConfirmed) {
                            navigate(`/myBookings`);
                        }
                    });
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    return (
        <div className="searchItem">
            <img src={data?.hotel?.photos[0]} alt="" className="siImg" />
            <div className="siDesc">
                <h1 className="siTitle">{data?.hotel?.name}</h1>
                <p className='location-myB'>
                    <LocationOnIcon />
                    {data?.hotel?.city}
                </p>
                <div className='bookedRoomsContainer'>
                    <h3>Booked Rooms</h3>
                    {data?.rooms.map(room => (
                        <div key={room._doc._id} className="bookedRoom">
                            <div className='bookedRoomInfo'>
                                <img src={room._doc.img} className='bookedRoomImg' alt={`Room ${room._doc.title}`} />
                                <span>{room._doc.title}</span>
                            </div>
                            <button className="showRoomNumbersButton" onClick={toggleRoomNumbers}>
                                Room Numbers
                            </button>
                            {showRoomNumbers && (
                                <div className="roomNumbersContainer">
                                    {room?.bookedRooms?.map(br => (
                                        <span key={br} className='bookedRoomNumber'>{br}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>

            </div>
            <div className="siDetails">
                <div className="siRating">
                    <span>Excellent</span>
                    <button>{data?.hotel?.rating}</button>
                </div>
                <div className="siDetailsTexts">
                    <div className="booked-dates">
                        <span>
                            from: {moment(data?.from).format('MMMM DD, YYYY')}
                        </span>
                        <br />
                        <span>
                            to: {moment(data?.to).format('MMMM DD, YYYY')}
                        </span>
                    </div>
                    <button className="siCheckButton1" onClick={() => { handleCancellation(data?.id, user?._id) }}>Cancel Reservation</button>

                </div>
            </div>
        </div>
    );
};

export default BookedHotel;
