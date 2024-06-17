import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/fetchData";
import { searchContext } from "../../context/SearchContext";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import mongoose from "mongoose";
import { useNavigate } from "react-router-dom";

const Reserve = ({ id, openModal, setOpenModal, hotel }) => {
    const { user } = useContext(AuthContext);
    const { dates, options } = useContext(searchContext);
    const [selected, setSelected] = useState(new Set());
    const { data, loading, error } = useFetch(`/hotels/room/${id}`);
    const { isGoogleLogin, token } = useContext(AuthContext);
    const MySwal = withReactContent(Swal);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const checkboxes = document.getElementsByClassName("roomCheckBox");

        Array.from(checkboxes).forEach(async (checkbox) => {
            if (checkbox.checked) {

                const index = bookings.findIndex((ele) => ele.id == checkbox.value);

                if (bookings.length == 0 || index == -1) {
                    setBookings([...bookings, { id: checkbox.value, roomNumbers: [checkbox.dataset.val] }]);
                } else {

                    const updated_bookings = [...bookings];
                    updated_bookings[index].roomNumbers.push(checkbox.dataset.val);

                    setBookings(updated_bookings);
                }
            }
        });

    }, [selected]);

    const isAvailable = (maxPeople, unavailableDates) => {
        if (maxPeople < options.adults + options.children) {
            return true;
        }
        for (let i = 0; i < unavailableDates.length; i++) {
            const dateObject = new Date(unavailableDates[i]);
            if (dateObject >= dates[0]?.startDate && dateObject <= dates[0]?.endDate) {
                return true;
            }
        }
        return false;
    };


    const handleSelect = (e) => {
        const newSet = new Set(selected);
        if (e.target.checked) {
            newSet.add(e.target.dataset.val);
        } else {
            newSet.delete(e.target.dataset.val);
        }
        setSelected(newSet);
    }

    const handleSelected = (e) => {
        const set = new Set(selected);
        set.delete(e.target.closest('span').dataset.value);

        let checkboxes = document.getElementsByClassName("roomCheckBox");
        Array.from(checkboxes).forEach(element => {
            if (element.checked && element.dataset.val == e.target.closest('span').dataset.value) {
                element.checked = false;
            }
        });
        setSelected(set);
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    }

    async function completeReservation() {
        if (selected.size == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please Select a Room before proceeding!',
            })
            return;
        }


        try {

            const userResponse = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to reserve the selected Rooms?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!',
                cancelButtonText: 'No, cancel!'
            });

            if (userResponse.isConfirmed) {

                const response = await handleBooking();

                const userUpdateRes = await bookingsUpdate();
                const { status, data } = userUpdateRes;

                if (status == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Room Booked Successfully!',
                        text: 'Your room has been successfully booked.',
                        confirmButtonText: 'Okay!'
                    }).then((user_res) => {
                        if (user_res.isConfirmed) {
                            navigate(`/hotel/${id}`);
                        }
                    });

                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // async function displayRazorpay() {

    //     if (selected.size == 0) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Please Select a Room before proceeding!',
    //         })
    //         return;
    //     }
    //     const res = await loadScript(
    //         "https://checkout.razorpay.com/v1/checkout.js"
    //     );

    //     if (!res) {
    //         alert("Razorpay SDK failed to load. Are you online?");
    //         return;
    //     }

    //     const result = await axios.post("/payment/orders", { amount: hotel?.cheapestPrice });
    //     const { data } = result;

    //     if (!result) {
    //         alert("Server error. Are you online?");
    //         return;
    //     }

    //     const { amount, id: order_id, currency, user } = data.order;


    //     const options = {
    //         key: process.env.RAZORPAY_KEY,
    //         amount: amount.toString(),
    //         currency: currency,
    //         name: user?.username || localStorage.getItem("user")?.username,
    //         description: `Complete payment for Successful Reservation.`,
    //         order_id: order_id,
    //         handler: async function (response) {
    //             const data = {
    //                 orderCreationId: order_id,
    //                 razorpayPaymentId: response.razorpay_payment_id,
    //                 razorpayOrderId: response.razorpay_order_id,
    //                 razorpaySignature: response.razorpay_signature,

    //             };


    //             try {
    //                 // const response = await handleBooking(data);

    //                 const userUpdateRes = await bookingsUpdate();
    //                 const { status, data } = userUpdateRes;

    //                 if (status == 200) {
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Room Booked Successfully!',
    //                         text: 'Your room has been successfully booked.',
    //                         confirmButtonText: 'Okay!'
    //                     }).then((user_res) => {
    //                         if (user_res.isConfirmed) {
    //                             navigate(`/hotel/${id}`);
    //                         }
    //                     });

    //                 }
    //             } catch (error) {
    //                 throw new Error(error.message);
    //             }

    //             // const update_payment = await axios.post(`/payment/success`, paymentData);

    //         },
    //         theme: {
    //             color: "#61dafb",
    //         },
    //     };

    //     if (user?.email && user?.username && user?.phone) {
    //         options.prefill = {
    //             name: user.username,
    //             email: user.email,
    //             contact: user.phone,
    //         };
    //     }

    //     const paymentObject = new window.Razorpay(options);
    //     paymentObject.open();
    // }

    const bookingsUpdate = async () => {
        try {

            const config = {
                headers: {
                    'Authorization': localStorage.getItem('token') || token
                },
                data: {
                    userId: user._id || localStorage.getItem('user')._id,
                    from: dates[0].startDate,
                    to: dates[0].endDate,
                    hotelId: hotel._id,
                    bookedRooms: bookings
                }
            };

            const res = await axios.put('/users/update_bookings', config);
            const { data, status } = res;

            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const handleBooking = async () => {
        const checkboxes = document.getElementsByClassName("roomCheckBox");
        const startDate = dates[0].startDate.toISOString();
        const endDate = dates[0].endDate.toISOString();


        Array.from(checkboxes).forEach(async (checkbox) => {
            if (checkbox.checked) {
                try {
                    const config = {
                        params: {
                            isGoogleLogin
                        }
                    }

                    const res = await axios.put(`/hotels/book?id=${id}&roomNumber=${checkbox.dataset.val}&startDate=${startDate}&endDate=${endDate}&roomid=${checkbox.value}`, config);

                    const { data, status } = res;

                    if (status !== 200) {
                        throw new Error("Error updating booked dates for the selected room Number!");
                    }
                } catch (error) {
                    // console.error(error);
                    throw new Error(error.message);
                }
            }
        });

    }

    return (
        <>
            {openModal &&
                <div className="reserve">
                    <div className="rContainer">
                        <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => { setOpenModal(false) }} />
                        <span><b>Select your Rooms:</b></span>
                        <div className="selectedRooms">
                            {
                                Array.from(selected).map(item => {
                                    return (
                                        <span className="seletedNumber" data-value={item}>
                                            {item}
                                            <FontAwesomeIcon icon={faCircleXmark} className="selectedClose" onClick={(e) => { handleSelected(e) }} />
                                        </span>
                                    );
                                })
                            }
                        </div>
                        {data?.map((item, i) => {
                            return (
                                <div className="rItem" key={i}>
                                    <div className="rItemInfo">
                                        <div className="rTitle">{item.title}</div>
                                        <div className="rDesc">{item.desc}</div>
                                        <div className="rMax">Max People: <b>{item.maxPeople}</b></div>
                                        <div className="rPrice">₹{item.price}</div>
                                    </div>
                                    <div className="roomImgForReservationContainer">
                                        <img src={item?.img} className="roomImgForReservation" height="100%" width="100%" />
                                    </div>
                                    <div className="roomContainer">
                                        {item.roomNumbers.map((roomNumber, i) => {
                                            return (
                                                <div className="room" key={i}>
                                                    <label>{roomNumber.number}</label>
                                                    <input type="checkbox" className="roomCheckBox" value={item._id} data-val={roomNumber.number} disabled={isAvailable(item?.maxPeople, roomNumber.unavailableDates)} onChange={(e) => { handleSelect(e) }} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            );
                        })}
                        <button className="rButton" onClick={completeReservation}>Reserve Now!</button>

                    </div>
                </div>}
        </>
    );
}

export default Reserve;
