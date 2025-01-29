import React, { useContext, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';
import "./map.css";
import axios, { all } from 'axios';
import { searchContext } from '../../context/SearchContext';

const HereMap = ({ closeIconClick, mapOpen, center }) => {
    const mapContainerRef = useRef(null);
    const { dispatch } = useContext(searchContext);
    const API_KEY = process.env.REACT_APP_HERE_API_KEY;

    const loadMaps = async () => {

        const scripts = [
            'https://js.api.here.com/v3/3.1/mapsjs-core.js',
            'https://js.api.here.com/v3/3.1/mapsjs-service.js',
            'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
            'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js',
        ];

        const res = await axios.get(`${process.env.BACKEND_HOSTED_URL}/hotels/getAllHotels`);

        const { data: hotels, status } = res;
        if (status == 200 || Math.floor(status / 100) == 2) {

            const appendScript = (src, id) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.id = id;
                    script.async = false;

                    script.onload = () => {
                        resolve(src);
                    }

                    script.onerror = () => {
                        reject(src);
                    }

                    document.body.appendChild(script);
                });
            }

            const loadScriptSequentially = async () => {
                for (const [i, script] of scripts.entries()) {
                    try {
                        await appendScript(script, `map_script_${i}`);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            const setMapViewBounds = (mapObj) => {
                const bbox = new window.H.geo.Rect(42.3736, -71.0751, 42.3472, -71.0408);

                mapObj.getViewModel().setLookAtData({
                    bounds: bbox
                });
            }


            function addMarkerToGroup(group, coordinate, html) {
                var marker = new window.H.map.Marker(coordinate); // Accessing H object using window
                // add custom data to the marker
                marker.setData(html);
                group.addObject(marker);
            }


            function addInfoBubble(map, ui, platform) {
                var group = new window.H.map.Group(); // Accessing H object using window

                window.group = group;
                map.addObject(group);

                // add 'tap' event listener, that opens info bubble, to the group
                // console.log(window.H.map.Polyline.toString());
                group.addEventListener('tap', function (evt) {
                    var bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
                        // Accessing H.ui namespace correctly
                        content: evt.target.getData()
                    });

                    ui.addBubble(bubble);


                    let loc = evt.target.getGeometry();
                    bubble.addEventListener('statechange', (event) => {
                        if (event.target.getState() === window.H.ui.InfoBubble.State.CLOSED && window.polylines) {
                            const getAllPolyLines = () => {
                                let polylines = window.polylines;
                                let polyLinesToBeRemoved = polylines.filter((pl) => {
                                    let geoArray = pl.getGeometry().ia[0].T || pl.getGeometry().la[0]['$'];
                                    console.log(geoArray);
                                    let len = geoArray.length;
                                    console.log("geometry for loc: ", loc.lat, loc.lng);
                                    console.log("geometry for geoArray: ", geoArray[len - 3], geoArray[len - 2]);

                                    return geoArray[len - 3].toFixed(3) == loc.lat.toFixed(3) && geoArray[len - 2].toFixed(3) == loc.lng.toFixed(3)
                                });

                                return polyLinesToBeRemoved;
                            }

                            const bubbleContainer = document.querySelector('.infoBubbleContainer');

                            if (bubbleContainer) {
                                const routeSummary = bubbleContainer.querySelector('.routeSummary');

                                if (routeSummary) {
                                    bubbleContainer.removeChild(routeSummary);
                                } else {
                                    console.log("No element with class 'routeSummary' found within '.infoBubbleContainer'");
                                }
                            } else {
                                console.log("No element with class 'infoBubbleContainer' found");
                            }

                            group.removeObjects(getAllPolyLines());
                            // console.log("geometry for closed bubble", evt.target.getGeometry());
                            // console.log(map.removeObject(window.polylines[0]));
                            // const clickedBubbleData = event.target.getData(); // Get bubble data


                            // const polylineToRemove = map.getObjects().find(object => {
                            //     console.log(Object.getPrototypeOf(object) === window.H.geo.LineString.prototype);
                            //     return object instanceof window.H.map.Polyline
                            // });
                            // console.log(polylineToRemove);
                            // if (polylineToRemove) {
                            //     map.removeObject(polylineToRemove);
                            // } else {
                            //     console.log("No matching polyline found for closed bubble.");
                            // }
                        }
                    });

                }, false);

                const printFunc = () => {
                    console.log("function is passed and called successfully!");
                }

                for (let i = 0; i < hotels.length; i++) {
                    addMarkerToGroup(group, { lat: hotels[i]?.coordinates[0], lng: hotels[i]?.coordinates[1] },
                        `<div class='infoBubbleContainer'>
                            <div class='hotelInMap'>
                                <img src=${hotels[i].photos[0]} class='imgInMap' onclick='handleImgClickOnMap("${hotels[i]?._id}")'/>   
                                <div class='textInMap'>
                                    <a href='/hotel/${hotels[i]._id}' class='hotelNameInMap'>
                                        ${hotels[i].name}
                                    </a>
                                    <div class='ratingInMap'>
                                        <span class='rInMap'>
                                            ${hotels[i].rating} 
                                        </span>
                                        <span class='rInMap_text'>
                                            ${hotels[i].rating > 4 ? 'Excellent' : (hotels[i].rating > 3 ? 'Good' : 'Average')}
                                        </span>
                                    </div>

                                    <div class='mapBtnContainer'>   
                                        <button type='button' class='mapBtnDir' onclick='showDirections("${hotels[i].coordinates}", "pedestrian")'><i class="fa-solid fa-person-walking dir-icon"></i></button>
                                        <button type='button' class='mapBtnDir' onclick='showDirections("${hotels[i].coordinates}", "car")'><i class="fa-solid fa-car dir-icon"></i></button>
                                    </div>
                                </div>
                            </div> 
                        </div>`
                    );
                }
            }


            loadScriptSequentially().then(() => {

                const platform = new window.H.service.Platform({
                    'apikey': API_KEY
                });
                window.platform = platform;
                const defaultLayers = platform.createDefaultLayers();

                // const options = {
                //     center: {
                //         lat: 30.123748754600438,
                //         lng: 78.79377365112305
                //     },
                //     zoom: 20
                // };

                const options = {
                    center: { lat: center[0], lng: center[1] },
                    zoom: 10,
                    pixelRatio: window.devicePixelRatio || 1
                };

                const map = new window.H.Map(mapContainerRef.current, defaultLayers.vector.normal.map, options);
                window.map = map;
                window.addEventListener('resize', () => map.getViewPort().resize());

                const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
                const ui = new window.H.ui.UI.createDefault(map, defaultLayers);
                window.ui = ui;
                addInfoBubble(map, ui, platform);


            }).catch((error) => {
                console.error('Failed to load the script' + error);
            });

        }
    }

    loadMaps();
    // return () => {
    //     for (const scriptId of scripts.map((_, index) => `map_script_${ index } `)) {
    //         const scriptToBeRemoved = document.getElementById(scriptId);
    //         if (scriptToBeRemoved && scriptToBeRemoved.parentNode) {
    //             scriptToBeRemoved.parentNode.removeChild(scriptToBeRemoved);
    //         }
    //     }
    // };


    if (mapOpen) {
        document.body.style.overflow = 'hidden';
    }

    return (
        <>
            <div className="mapContainer">
                <Tooltip title="Close Map">
                    <CloseIcon className='closeIconMap' onClick={() => { closeIconClick(!mapOpen) }} />
                </Tooltip>
                <div ref={mapContainerRef} id="hereMap" />
            </div>
        </>
    );
};

export default HereMap;
