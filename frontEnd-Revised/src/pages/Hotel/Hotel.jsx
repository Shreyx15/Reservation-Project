import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/Footer/Footer';
import { useContext, useEffect, useState } from 'react';
import useFetch from '../../hooks/fetchData';
import { useLocation } from 'react-router-dom';
import { searchContext } from "../../context/SearchContext";
import Cookies from 'js-cookie';
import Reserve from '../../components/reserve/Reserve';
import './hotel.css';
import useAuthCheck from '../../hooks/useAuthCheck';
import { ToastContainer } from 'react-toastify';

function Hotel() {
    const { isLoggedIn } = useAuthCheck();
    const location = useLocation();
    const Id = location.pathname.split('/')[2];
    const [sliderNumber, setSliderNumber] = useState(0);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { data, loading, error, reFetch } = useFetch(`/hotels/find/${Id}`);
    const { dates, options, query } = useContext(searchContext);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (navigator.geolocation && data !== undefined && data.coordinates !== undefined) {

            navigator.geolocation.getCurrentPosition(calculateDistance);

            function calculateDistance(position) {
                const lat2 = position.coords.latitude;
                const lon2 = position.coords.longitude;
                const lat1 = data && data?.coordinates[0];
                const lon1 = data && data?.coordinates[1];

                const R = 6371; // Radius of the Earth in kilometers
                const dLat = Math.abs(lat2 - lat1) * (Math.PI / 180);
                const dLon = Math.abs(lon2 - lon1) * (Math.PI / 180);

                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c; // Distance in kilometers

                setDistance(Number(distance.toFixed(1)));
            }
        }

    }, [data]);

    const handleOpen = (i) => {
        setSliderNumber(i);
        setOpen(true);
    }

    const handleMove = (direction) => {
        let newSliderNumber;

        if (direction === "l") {
            newSliderNumber = sliderNumber === 0 ? 5 : sliderNumber - 1;
        } else {
            newSliderNumber = sliderNumber === 5 ? 0 : sliderNumber + 1;
        }
        setSliderNumber(newSliderNumber);
    }

    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

    function dateDifference(date1, date2) {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const dayDiff = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
        return dayDiff + 1;
    }

    const dayDiff = dateDifference(dates[0].endDate, dates[0].startDate);

    console.log("day difference", dayDiff)
    console.log("distance in km", distance);

    return (
        isLoggedIn ?
            <div>
                <Navbar />
                <Header type="list" />

                {open &&
                    <div className="slider">
                        <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={() => { setOpen(false) }} />
                        <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={() => { handleMove("l") }} />
                        <div className="sliderWrapper">
                            <img src={data?.photos[sliderNumber]} alt="" className='sliderImg' />
                        </div>
                        <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={() => { handleMove("r") }} />
                    </div>
                }

                <div className="hotelContainer">
                    <div className="hotelWrapper">
                        <button className="bookNow" onClick={() => { setOpenModal(true) }}>Reserve or book now!</button>
                        <h1 className="hotelTitle">{data?.name}</h1>
                        <div className="hotelAddress">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className="hotelDistance">
                                Excellent location - {distance} Kilometers from Your current Location
                            </span>
                        </div>
                        {/* <span className="hotelPriceHighlight">
                            Book a stay over 4114 at this property and get a free airport taxi
                        </span> */}

                        <div className="hotelImages">
                            {
                                data?.photos?.map((photo, i) => (
                                    <div className="hotelImgWrapper" key={i}>
                                        <img onClick={() => { handleOpen(i) }} src={photo} alt="" className="hotelImg" />
                                    </div>
                                ))
                            }
                        </div>

                        <div className="hotelDetails">
                            <div className="hotelDetailsTexts">
                                <h1 className="hotelTitle">{data?.name}</h1>
                                <p className="hotelDesc">
                                    {data?.desc}
                                </p>
                            </div>
                            <div className="hotelDetailsPrice">
                                <h1>Perfect for a {dayDiff}-night stay!</h1>
                                <span>
                                    Couples particularly like the location — they rated it {data?.rating} for a two-person trip.
                                </span>
                                <h2>
                                    <b>₹{dayDiff * data?.cheapestPrice}</b>( {dayDiff} nights)
                                </h2>
                                <button onClick={() => { setOpenModal(true) }}>Reserve or book now!</button>
                            </div>
                        </div>
                    </div>
                    <MailList />
                    <Reserve id={Id} openModal={openModal} setOpenModal={setOpenModal} hotel={data} />
                    <Footer />
                </div>
            </div> : <h1>You are not Authorized!</h1>

    );
}

export default Hotel;