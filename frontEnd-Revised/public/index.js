const handleImgClickOnMap = (hotelId) => {
    window.location.href = `/hotel/${hotelId}`;
}

const showDirections = (coords, mode) => {
    const platform = window.platform;
    const map = window.map;
    const group = window.group;
    window.polylines = [];
    var bubble;
    // console.log(platform, group, map);
    // 28.57994686164284, 77.1896277255933
    // console.log();
    const coordinates = coords.split(",");
    coordinates.map((co_or) => Number(co_or).toFixed(2));

    const onSuccess = (position) => {
        const {
            latitude,
            longitude
        } = position.coords;

        const origin = { lat: Number(latitude).toFixed(2), lng: Number(longitude).toFixed(2) };
        const destination = { lat: coordinates[0], lng: coordinates[1] };

        // Create the parameters for the routing request:
        const routingParameters = {
            origin: `${origin.lat},${origin.lng}`,
            // The end point of the route:
            destination: `${destination.lat},${destination.lng}`,
            // origin: , // Fernsehturm
            // destination: '52.5034,13.3280',
            // Include the route shape in the response 
            return: 'polyline,actions,travelSummary'
        };

        if (mode !== 'public') {
            routingParameters.routingMode = 'fast';
            routingParameters.transportMode = mode;
        }

        const addRouteShapeToMap = (route) => {
            const lineStrings = [];
            route.sections.forEach((section) => {
                // Create a linestring to use as a point source for the route line
                lineStrings.push(window.H.geo.LineString.fromFlexiblePolyline(section.polyline));
            });

            // Create an instance of H.geo.MultiLineString
            const multiLineString = new window.H.geo.MultiLineString(lineStrings);

            // Create a polyline to display the route:
            const routeLine = new window.H.map.Polyline(multiLineString, {
                style: {
                    lineWidth: 6, // Increase line width
                    strokeColor: 'rgba(0, 120, 255, 0.8)', // Semi-transparent blue color
                }
            });
            // let geoArray = routeLine.getGeometry().la[0]['$'];
            // console.log("geometry for the routleline: latitude:", geoArray[geoArray.length - 3], "longitude: ", geoArray[geoArray.length - 2]);
            // Create a marker for the start point:
            const startMarker = new window.H.map.Marker(origin);
            // const endMarker = new window.H.map.Marker(destination);
            // Create a H.map.Group to hold all the map objects and enable us to obtain 
            // the bounding box that contains all its objects within

            window.polylines.push(routeLine);
            group.addObjects([routeLine, startMarker]);
            // Add the group to the map
            map.addObject(group);

            // Set the map viewport to make the entire route visible:
            map.getViewModel().setLookAtData({
                bounds: group.getBoundingBox()
            });
        }

        Number.prototype.toMMSS = function () {
            const hours = Math.floor(this / 3600);
            const minutes = Math.floor((this % 3600) / 60);
            const seconds = this % 60;

            let result = '';
            if (hours > 0) {
                result += hours + ' hours ';
            }
            if (minutes > 0) {
                result += minutes + ' minutes ';
            }
            if (seconds > 0) {
                result += seconds + ' seconds';
            }

            return result.trim();
        };


        const addSummaryToPanel = (route) => {
            let duration = 0,
                distance = 0;

            route.sections.forEach((section) => {
                distance += section.travelSummary.length;
                duration += section.travelSummary.duration;
            });

            const bubbleContainer = document.getElementsByClassName('infoBubbleContainer')[0];
            // console.log(bubbleContainer);
            const routeSummary = document.getElementsByClassName('routeSummary');
            console.log("length of the route summary: ", routeSummary.length);
            if (routeSummary.length > 0) {
                bubbleContainer.removeChild(routeSummary[0]);
            } else {
                console.log("No element with class 'routeSummary' found within '.infoBubbleContainer'");
            }

            var summaryDiv = document.createElement('div')
            let content = '';
            summaryDiv.className = 'routeSummary';
            content += '<b>Total distance</b>: ' + (distance / 1000) + 'km. <br/>';
            content += '<b>Travel Time</b>: ' + duration.toMMSS();

            summaryDiv.style.fontSize = 'small';
            summaryDiv.style.marginLeft = '5%';
            summaryDiv.style.marginRight = '5%';
            summaryDiv.innerHTML = content;
            bubbleContainer.appendChild(summaryDiv);
        }

        // Define a callback function to process the routing response:
        const onResult = function (result) {
            // Ensure that at least one route was found
            if (result.routes.length) {
                const route = result.routes[0];

                addRouteShapeToMap(route);
                addSummaryToPanel(route);
            };
        };

        if (mode !== 'public') {
            const router = platform.getRoutingService(null, 8);

            // Call the calculateRoute() method with the routing parameters,
            // the callback, and an error callback function (called if a
            // communication error occurs):
            router.calculateRoute(routingParameters, onResult,
                function (error) {
                    alert(error.message);
                });
        } else {
            const router = platform.getPublicTransitService();

            router.getRoutes(
                routingParameters,
                onResult,
                function (error) {
                    alert(error.message);
                }
            );
        }

    }


    navigator.geolocation.getCurrentPosition(onSuccess);
}