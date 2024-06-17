import useFetch from "../../hooks/fetchData";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { searchContext } from "../../context/SearchContext";

import "./featured.css";

const Featured = () => {
    const navigate = useNavigate();
    const { query, dates, options, dispatch } = useContext(searchContext);
    const { data, error, loading } = useFetch("/hotels/getFeatured");
    const [imageWindow, setImageWindow] = useState({
        start: 0,
        end: 4
    });
    // console.log(data);

    const countByCity = [];
    const keys = Object.keys(data);

    const handleSearch = (e, city) => {
        const action = {
            type: "UPDATE",
            payload: {
                query: city,
                dates: dates,
                options: options
            }
        }
        dispatch(action);
        navigate("/hotels");
    }
    console.log(keys);
    for (let i = imageWindow.start; i < Math.min(imageWindow.end, keys.length); i++) {
        if (data?.hasOwnProperty(keys[i])) {
            countByCity.push(
                <>
                    <img src={data[keys[i]].image} alt="" className="featuredImg" />

                    <div className="featuredTitles">
                        <h1>{keys[i]}</h1>
                        <h2>{data[keys[i]].count}</h2>
                    </div>
                </>
            );
        }
        console.log(data[keys[0]].image);
    }
    // countByCity.pop();


    const handleClick = (operation) => {
        if (operation === "i") {
            setImageWindow({
                start: imageWindow.start + 1,
                end: imageWindow.end + 1
            });
        } else {
            setImageWindow({
                start: imageWindow.start - 1,
                end: imageWindow.end - 1
            });
        }
    }

    const displayRight = () => {
        console.log(keys);
        if (imageWindow.end == keys.length + 1) {
            return false;
        } else {
            return true;
        }
    }

    const displayLeft = () => {
        if (imageWindow.start == 0) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <>
            <div className="featured">
                {displayRight() && <span onClick={e => { handleClick("i") }} className="slider-right">&gt;</span>}
                {displayLeft() && <span onClick={e => { handleClick("d") }} className="slider-left">&lt;</span>}

                {countByCity?.map((item, i) => {
                    return (
                        <div className="featuredItem" key={i} data-city={keys[i]} onClick={e => handleSearch(e, keys[i])}>
                            {item}
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default Featured;