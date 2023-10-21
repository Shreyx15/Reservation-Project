import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/fetchData";
import { searchContext } from "../../context/SearchContext";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Reserve = ({ id, openModal, setOpenModal }) => {
    const { dates } = useContext(searchContext);
    const [selected, setSelected] = useState(new Set());
    const { data, loading, error } = useFetch(`/hotels/room/${id}`);
    const MySwal = withReactContent(Swal);

    // console.log(data);
    const isAvailable = (unavailableDates) => {
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

    const handleBooking = () => {
        const checkboxes = document.getElementsByClassName("roomCheckBox");
        const startDate = dates[0].startDate.toISOString();
        const endDate = dates[0].endDate.toISOString();

        Array.from(checkboxes).forEach(async (checkbox) => {
            if (checkbox.checked) {
                try {
                    // const res = await axios.put(`/hotels/book?id=${id}&roomNumber=${checkbox.dataset.val}&startDate=${startDate}&endDate=${endDate}&roomid=${checkbox.value}`);
                    MySwal.fire({
                        title: <p style={{ fontSize: "15px" }}>Rooms successfully Booked!</p>,
                        icon: "success",
                        confirmButtonText: "ok",
                        confirmButtonColor: "#0071c2",
                        width: "max-content",
                    });

                } catch (error) {
                    console.error(error);
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
                                        <div className="rPrice">{item.price}</div>
                                    </div>

                                    <div className="roomContainer">
                                        {item.roomNumbers.map((roomNumber, i) => {
                                            return (
                                                <div className="room" key={i}>
                                                    <label>{roomNumber.number}</label>
                                                    <input type="checkbox" className="roomCheckBox" value={item._id} data-val={roomNumber.number} disabled={isAvailable(roomNumber.unavailableDates)} onChange={(e) => { handleSelect(e) }} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            );
                        })}
                        <button className="rButton" onClick={handleBooking}>Reserve Now!</button>

                    </div>
                </div>}
        </>
    );
}

export default Reserve;
