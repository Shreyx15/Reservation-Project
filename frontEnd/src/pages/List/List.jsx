import "./list.css";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import { format, milliseconds } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { DateRangePicker } from 'react-date-range';
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/fetchData";
import { searchContext } from "../../context/SearchContext";
import Cookies from "js-cookie";

function List() {
    const { city, dates, options } = useContext(searchContext);
    const [destination, setDestination] = useState(city);
    const [dateRange, setDateRange] = useState(dates);
    const [option, setOptions] = useState(options);
    const [showDate, setShowDate] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const { data, reFetch, error, loading } = useFetch(`/hotels/getHotelsByCity?city=${destination}`);
    const { dispatch } = useContext(searchContext);

    useEffect(() => {
        const action = {
            type: "UPDATE",
            payload: {
                city: destination,
                dates: dateRange,
                options: option
            }
        }
        dispatch(action);
    }, [destination, dateRange, option]);

    return (
        Cookies.get("access_token") ?
            <div>
                <Navbar />
                <Header type="list" />
                <div className="listContainer">
                    <div className="listWrapper">
                        <div className="listSearch">
                            <h1 className="lsTitle">Search</h1>
                            <div className="lsItem">
                                <label>Destination</label>
                                <input type="text" value={destination} onChange={(e) => {
                                    setDestination(e.target.value);
                                }} />
                            </div>
                            <div className="lsItem">
                                <label>Check-in Date</label>
                                <span onClick={() => { setShowDate(!showDate) }}>{`${format(dateRange[0].startDate, "dd/MM/yyyy")} to ${format(dateRange[0].endDate, "dd/MM/yyyy")}`}</span>
                                {showDate && <DateRangePicker
                                    ranges={dateRange}
                                    onChange={(ranges) => {
                                        setDateRange([ranges.selection]);
                                    }}
                                    className="dateRange"
                                />}
                            </div>
                            <div className="lsItem">
                                <label>Options</label>
                                <div className="lsOptions">
                                    <div className="lsOptionItem">
                                        <span className="lsOptionText">
                                            Min Price <small>(per Night)</small>
                                        </span>
                                        <input type="number" className="lsOptionInput" onChange={(e) => { setMin(e.target.value) }} value={min} />
                                    </div>
                                    <div className="lsOptionItem">
                                        <span className="lsOptionText">
                                            Max Price <small>(per Night)</small>
                                        </span>
                                        <input type="number" className="lsOptionInput" onChange={(e) => { setMax(e.target.max) }} value={max} />
                                    </div>
                                    <div className="lsOptionItem">
                                        <span className="lsOptionText">
                                            Adult <small>per Night</small>
                                        </span>
                                        <input type="number" className="lsOptionInput" min={1} placeholder={option.adults} onChange={(e) => {
                                            setOptions({ ...option, adults: e.target.value })
                                        }} />
                                    </div>
                                    <div className="lsOptionItem">
                                        <span className="lsOptionText">
                                            Children <small>per Night</small>
                                        </span>
                                        <input type="number" className="lsOptionInput" min={0} placeholder={option.children} onChange={(e) => {
                                            setOptions({ ...option, children: e.target.value })
                                        }} />
                                    </div>
                                    <div className="lsOptionItem">
                                        <span className="lsOptionText">
                                            Room <small>per Night</small>
                                        </span>
                                        <input type="number" className="lsOptionInput" min={1} placeholder={option.rooms} onChange={(e) => {
                                            setOptions({ ...option, rooms: e.target.value })
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <button>Search</button>
                        </div>
                        <div className="listResult">
                            {loading ? <>Loading...</> :
                                <>
                                    {
                                        data.map(hotel => {
                                            return (
                                                <SearchItem item={hotel} key={hotel?._id} />
                                            )
                                        })
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div> : <h1>You are not Authorized!</h1>
    );
}

export default List;