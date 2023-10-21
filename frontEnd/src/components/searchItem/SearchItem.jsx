import "./searchItem.css";
import { Link } from 'react-router-dom';
const SearchItem = ({ item }) => {
    return (
        <div className="searchItem">
            <img src="https://cf.bstatic.com/xdata/images/hotel/square600/488315512.webp?k=169426af51c1295259e5aa51f928abad81e6c706f55eb7ac33fda872615fca43&o=" alt="" className="siImg" />
            <div className="siDesc">
                <h1 className="siTitle">{item?.name}</h1>
                <span className="siDistance">{item?.distance}</span>
                <span className="siTaxiOp">Free airport taxi</span>
                {/* <span className="siSubtitle">{item?.desc}</span> */}
                <span className="siFeatures">Entire studio</span>
                <span className="siFeatures">1 bathroom • 21m² 1 full bed</span>
                <span className="siCancelOp">Free cancellation</span>
                <span className="siCancelOpSubtitle">
                    You can cancel later, so luck in this great price today
                </span>
            </div>
            <div className="siDetails">
                <div className="siRating">
                    <span>Excellent</span>
                    <button>{item?.rating}</button>
                </div>
                <div className="siDetailsTexts">
                    <span className="siPrice">${item?.cheapestPrice}</span>
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