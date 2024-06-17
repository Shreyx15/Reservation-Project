import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/fetchData';
import './featuredProperties.css';

const FeaturedProperties = () => {
    const { data, loading, reFetch, error } = useFetch("/hotels?featured=true&limit=4");
    const navigate = useNavigate();
    // console.log(data);

    const handleClick = (e, hotelId) => {
        navigate(`/hotel/${hotelId}`);
    }

    return (
        <div className='fp'>
            {loading ? <div>Loading....</div> :
                <>
                    {
                        data.map((hotel, i) => {
                            return (
                                <div className="fpItem" key={hotel?._id} onClick={e => handleClick(e, hotel?._id)}>
                                    <img src={hotel?.photos[0]} alt="no img" className="fpImg" />
                                    <span className="fpName">{hotel?.name}</span>
                                    <span className="fpCity">{hotel?.city}</span>
                                    <span className="fpPrice">Starting from <b>₹{hotel?.cheapestPrice}</b></span>
                                    <div className="fpRating">
                                        <button>{hotel?.rating}</button>
                                        <span>
                                            {hotel?.rating > 4 && <>Excellent</>}
                                            {hotel?.rating > 3 && hotel?.rating <= 4 && <>Good</>}
                                            {hotel?.rating > 2 && hotel?.rating <= 3 && <>Below Average</>}
                                            {hotel?.rating > 1 && hotel?.rating <= 2 && <>Poor</>}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    }

                </>
            }
        </div>
    );
};

export default FeaturedProperties;