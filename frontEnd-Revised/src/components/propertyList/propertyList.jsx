import { useState } from 'react';
import useFetch from '../../hooks/fetchData';
import React from './propertyList.css'
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
    const { data, loading, reFetch, error } = useFetch("/hotels/countByType");
    const navigate = useNavigate();

    const handleClick = (type) => {
        navigate(`/hotels?type=${type}`);
    }

    return (
        <div className='pList'>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {
                        data.length != 0 &&
                        data.map((item, i) => {
                            return (
                                <div className="pListItem" key={i} onClick={() => { handleClick(item?.type) }}>
                                    <img src={item?.image} alt="no img" className="pListImg" />
                                    <div className="pListTitle">
                                        <h1>{item?.type}</h1>
                                        <h2>{item?.count} Properties</h2>
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            )}
        </div>

    )
}
export default PropertyList;