import { useEffect, useState } from "react";
import "./searchItem.css";
import { Link } from 'react-router-dom';


const SearchItem = ({ item }) => {
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (navigator.geolocation && item !== undefined && item.coordinates !== undefined) {

            navigator.geolocation.getCurrentPosition(calculateDistance);

            function calculateDistance(position) {
                const lat2 = position.coords.latitude;
                const lon2 = position.coords.longitude;
                const lat1 = item && item?.coordinates[0];
                const lon1 = item && item?.coordinates[1];

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

    }, [item]);

    return (
        <div className="searchItem">
            <img src={item?.photos[0]} alt="" className="siImg" />
            <div className="siDesc">
                <h1 className="siTitle">{item?.name}</h1>
                <span className="siDistance">{distance} km</span>
                <span className="siTaxiOp">Free airport taxi</span>
                <span className="siSubtitle">{item?.desc}</span>
                <span className="siCancelOpSubtitle">
                    You can cancel later, so luck in this great price today
                </span>
            </div>
            <div className="siDetails">
                <div className="siRating">
                    <span>{item?.rating > 4 && 'Excellent'}{item?.rating > 3 && item?.rating < 4 && 'Good'}</span>
                    <button>{item?.rating}</button>
                </div>
                <div className="siDetailsTexts">
                    <span className="siPrice">₹{item?.cheapestPrice}</span>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <Link to={`/hotel/${item?._id}`}>
                        <button className="siCheckButton">See Availability</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;