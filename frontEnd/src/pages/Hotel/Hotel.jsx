import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/Footer/Footer';
import { useContext, useState } from 'react';
import useFetch from '../../hooks/fetchData';
import { useLocation } from 'react-router-dom';
import { searchContext } from "../../context/SearchContext";
import Cookies from 'js-cookie';
import Reserve from '../../components/reserve/Reserve';
import './hotel.css';

function Hotel() {
    const location = useLocation();
    const Id = location.pathname.split('/')[2];
    const [sliderNumber, setSliderNumber] = useState(0);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { data, loading, error, reFetch } = useFetch(`/hotels/find/${Id}`);
    const { dates, options, city } = useContext(searchContext);
    const photos = [
        { src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/461492275.jpg?k=c4ad76e973479f94cc4daa4cc616a22b62e64992ee40f00539737902f8208b51&o=&hp=1" },
        { src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/443844615.jpg?k=b93259add424068a27c16d92c1daaeb7de83d26d1a5bfc963e7f580eac85bcfe&o=&hp=1" },
        { src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/471191780.jpg?k=06a00661e926eb811bb095a9f4245ecb4999a9b5638ae7085a71a97b6661cd4d&o=&hp=1" },
        { src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/443844652.jpg?k=a0588110539eac1db509031fb630a6a0b430a7178a435a752ff35e7d5c04693c&o=&hp=1" },
        { src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/443844964.jpg?k=1a0de1564f687afcd573c48e0e4b6518fb0c6231b195e3b72f9fc4057324841d&o=&hp=1" }
    ];

    const handleOpen = (i) => {
        setSliderNumber(i);
        setOpen(true);
    }

    const handleMove = (direction) => {
        let newSliderNumber;

        if (direction === "l") {
            newSliderNumber = sliderNumber === 0 ? 4 : sliderNumber - 1;
        } else {
            newSliderNumber = sliderNumber === 4 ? 0 : sliderNumber + 1;
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
    return (
        Cookies.get("access_token") ?
            <div>
                <Navbar />
                <Header type="list" />
                {open && <div className="slider">
                    <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={() => { setOpen(false) }} />
                    <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={() => { handleMove("l") }} />
                    <div className="sliderWrapper">
                        <img src={photos[sliderNumber].src} alt="" className='sliderImg' />
                    </div>
                    <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={() => { handleMove("r") }} />

                </div>}
                <div className="hotelContainer">

                    <div className="hotelWrapper">
                        <button className="bookNow">Reserve or book now!</button>
                        <h1 className="hotelTitle">{data?.name}</h1>
                        <div className="hotelAddress">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className="hotelDistance">
                                Excellent location - 200m from center
                            </span>
                        </div>
                        <span className="hotelPriceHighlight">
                            Book a stay over 4114 at this property and get a free airport taxi
                        </span>
                        <div className="hotelImages">
                            {photos.map((photo, i) => (
                                <div className="hotelImgWrapper" key={i}    >
                                    <img onClick={() => { handleOpen(i) }} src={photo.src} alt="" className="hotelImg" />
                                </div>
                            ))}
                        </div>


                        <div className="hotelDetails">
                            <div className="hotelDetailsTexts">
                                <h1 className="hotelTitle">Stay in the heart of Krakow</h1>
                                <p className="hotelDesc">
                                    The Gold Beach Resort is situated in Daman, just 5 km from the city centre. It houses an outdoor swimming pool, a fitness centre and 2 dining options. The luxurious rooms offer floor-to-ceiling windows all around. Guests can pamper themselves at the seaside spa at an additional cost.

                                    The Golden Beach Resort is 6 km from Portuguese Fort and Daman Market, and 8 km from Jampore Beach. Vapi Railway Station is 10 km away, while Daman Airport is an hour’s drive away.

                                    Offering panoramic views, contemporary rooms are air-conditioned and fitted with wooden flooring. They feature a flat-screen TV with cable channels, a wardrobe and a seating area. Tea/coffee making facilities and a minibar are included.

                                    Guests can dine at Spice Galleon, or at 19 Sixty One, both serving a selection of Indian, Chinese and Continental delights. In-room dining is possible.

                                    Staff at The Golden Beach’s 24-hour reception can assist with luggage storage, laundry and ironing services. Meeting/banquet facilities are also available.

                                    Couples particularly like the location — they rated it 8.3 for a two-person trip.
                                </p>
                            </div>
                            <div className="hotelDetailsPrice">
                                <h1>Perfect for a 9-night stay!</h1>
                                <span>
                                    Couples particularly like the location — they rated it 8.3 for a two-person trip.
                                </span>
                                <h2>
                                    <b>${dayDiff * data?.cheapestPrice * options.rooms}</b>( {dayDiff} nights)
                                </h2>
                                <button onClick={() => { setOpenModal(true) }}>Reserve or book now!</button>
                            </div>
                        </div>
                    </div>
                    <MailList />
                    <Reserve id={Id} openModal={openModal} setOpenModal={setOpenModal} />
                    <Footer />
                </div>
            </div> : <h1>You are not Authorized!</h1>

    );
}

export default Hotel;