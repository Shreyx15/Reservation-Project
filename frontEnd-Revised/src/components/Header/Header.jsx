import { faBed, faCalendar, faCalendarDay, faCalendarDays, faCar, faFaceGrimace, faPerson, faPlane, faTaxi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRangePicker } from 'react-date-range';
import { useState, useEffect, useRef } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { compareAsc, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { searchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import { axios } from "../../axiosConfig";
import "./header.css";
import { handleFirebaseLogout } from "../../Firebase";
import Swal from "sweetalert2";

function Header({ type }) {
    const navigate = useNavigate();
    const searchDivRef = useRef(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adults: 0,
        children: 0,
        rooms: 0
    });

    const [destination, setDestination] = useState("");
    const { dispatch } = useContext(searchContext);
    const auth = useContext(AuthContext);

    useEffect(() => {
        let headerSearch = document.getElementsByClassName("headerSearch");
        if (headerSearch !== undefined && headerSearch[0] !== undefined) {

            if (suggestions.length > 0) {
                document.getElementsByClassName("headerSearch")[0].style.borderBottomRightRadius = "0";
                document.getElementsByClassName("headerSearch")[0].style.borderBottomLeftRadius = "0";
            } else {
                document.getElementsByClassName("headerSearch")[0].style.borderBottomRightRadius = "7px";
                document.getElementsByClassName("headerSearch")[0].style.borderBottomLeftRadius = "7px";
            }
        }
    }, [suggestions, showSuggestions]);

    useEffect(() => {

        if (destination === "") {
            setSuggestions([]);
        }

        const fetchSuggestions = async () => {
            const res = await axios.get(`/hotels/getSearchResults${destination ? '?query=' + destination : ''}`);
            const { data, status } = res;

            return status == 200 && data.length > 0 ? data : [];
        }

        if (showSuggestions) {
            fetchSuggestions()
                .then((res) => {
                    setSuggestions(res);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }, [destination, showSuggestions]);

    function handleOptions(name, operation) {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation == "i" ? prev[name] + 1 : prev[name] - 1
            }
        });
    }

    function handleSearch() {
        const action = {
            type: "UPDATE",
            payload: {
                query: destination,
                dates: dateRange,
                options: options
            }
        };
        dispatch(action);

        navigate("/hotels");
    }

    const handleSuggestionClick = (hotel) => {
        setDestination(hotel?.name);
        setShowSuggestions(false);
    }
    // console.log("modified suggestions is ", suggestions);

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
        setShowSuggestions(true);
    }

    const handleLogout = async () => {
        try {
            const response = await Swal.fire({
                icon: 'warning',
                title: 'Confirm Logout?',
                text: 'Are you sure you want to logout?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Logout',
                cancelButtonText: 'Cancel',
            });

            if (response.isConfirmed) {
                if (auth.isGoogleLogin) {
                    await handleFirebaseLogout(auth.dispatch);
                    navigate("/login");
                    return;
                }

                const res = await axios.post("/auth/logout", { isGoogleLogin: auth.isGoogleLogin });
                const { status } = res;

                if (status == 200) {
                    console.log(res);
                    const action = {
                        type: "LOGOUT"
                    }
                    auth.dispatch(action);
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div className="Header">
            <div className={`headerContainer ${type === "list" ? 'no-margin' : ''}`}>
                <div className="HeaderList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Stays</span>
                    </div>
                    <div className="headerListItem">
                        <button className="headerBtn logout" onClick={handleLogout}>LogOut</button>
                    </div>
                </div>

                {type !== "list" && <div><h1 className="headerTitle">
                    Find your next stay
                </h1>
                    <p className="headerDesc">
                        Search low prices on hotels, homes and much more...
                    </p>
                </div>}

                {type !== "list" &&
                    <div className="searchContainer">
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} style={{ color: "Lightgray" }} />
                                <input type="text" placeholder="Where do you want to go?" className="headerSearchInput" onChange={(e) => { handleDestinationChange(e) }} value={destination} />
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} style={{ color: "Lightgray" }} />
                                <span onClick={() => { setDateOpen(!dateOpen) }} className="headerSearchText">{`${format(dateRange[0].startDate, "dd/MM/yyyy")} to ${format(dateRange[0].endDate, "dd/MM/yyyy")}`}</span>
                                {dateOpen && <DateRangePicker
                                    ranges={dateRange}
                                    onChange={(ranges) => { setDateRange([ranges.selection]); console.log(dateRange) }}
                                    className="date"
                                />}
                            </div>

                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faPerson} style={{ color: "Lightgray" }} />
                                <span className="headerSearchText" onClick={() => { setOpenOptions(!openOptions) }}>{`${options.adults} adults | ${options.children} children | ${options.rooms} rooms`}</span>
                                {openOptions && <div className="options">
                                    <div className="optionItem">
                                        <span className="optionText">Adults</span>
                                        <div className="optionCounter">
                                            <button className="optionCounterButton" onClick={() => { handleOptions("adults", "d") }} disabled={options.adults < 1}>-</button>
                                            <span className="optionCounterNumber">{options.adults}</span>
                                            <button className="optionCounterButton" onClick={() => { handleOptions("adults", "i") }}>+</button>
                                        </div>
                                    </div>

                                    <div className="optionItem">
                                        <span className="optionText">Children</span>
                                        <div className="optionCounter">
                                            <button className="optionCounterButton" onClick={() => { handleOptions("children", "d") }} disabled={options.children < 1}>-</button>
                                            <span className="optionCounterNumber">{options.children}</span>
                                            <button className="optionCounterButton" onClick={() => { handleOptions("children", "i") }}>+</button>
                                        </div>
                                    </div>

                                    <div className="optionItem">
                                        <span className="optionText">Rooms</span>
                                        <div className="optionCounter">
                                            <button className="optionCounterButton" onClick={() => { handleOptions("rooms", "d") }} disabled={options.rooms < 1}>-</button>
                                            <span className="optionCounterNumber">{options.rooms}</span>
                                            <button className="optionCounterButton" onClick={() => { handleOptions("rooms", "i") }}>+</button>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                            <div className="headerSearchItem">
                                <button className="headerBtn" onClick={handleSearch}>Search</button>
                            </div>
                        </div>

                        {showSuggestions &&
                            <div id="searchSuggestions" ref={searchDivRef}>
                                {
                                    suggestions?.map((obj, index) => {
                                        return (
                                            <div className="suggestionHotel" key={index} onClick={() => { handleSuggestionClick(obj.hotel) }}>
                                                <i class="fa-solid fa-location-dot"></i>
                                                <div className="suggestion">
                                                    <b className="sugg-title">
                                                        {obj.hotel?.name}
                                                    </b>
                                                    <div className="suggestionText">
                                                        {obj.hotel?.address}
                                                    </div>
                                                </div>
                                            </div>

                                        );
                                    })
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default Header;