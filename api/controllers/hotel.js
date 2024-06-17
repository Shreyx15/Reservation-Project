const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { createError } = require("../utils/error");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const { sendMail } = require("./sendMail");
const { cloudinaryImageArrayUpload, uploadToCloudinary, deleteImageFromCloudinary } = require("./cloudinary");

const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    private_cdn: false,
    secure_distribution: null,
    secure: true
};

cloudinary.config(config);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.APP_PASSWORD
    }
});
// console.log(process.env.APP_PASSWORD);

module.exports.createHotel = async (req, res, next) => {
    const { city, name, featured } = req.body;
    try {
        // console.log(req.files);
        const images = req.files;

        const fetchCoordinates = async () => {
            const query = encodeURIComponent(`${name}, ${city}`);
            const uri = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}`;

            try {
                const response = await fetch(uri);
                const data = await response.json();

                if (response.ok) {
                    const { lat, lon } = data[0];
                    return [parseFloat(lat), parseFloat(lon)];
                }
            } catch (error) {
                return new Error("Error fetching coordinates!");

            }
        }

        let coordinates = [];
        try {
            coordinates = await fetchCoordinates();
        } catch (error) {
            return res.status(500).json(error);
        }
        // console.log(coordinates);
        const urls = [];
        const options = {
            resource_type: 'image',
            folder: `ReservationApp/Hotels/${city}/${name}`,
            stream: true
        };

        for (const img of images) {
            const url = await uploadToCloudinary(img, options, res);
            await urls.push(url);
        }
        // // console.log(req.body);
        const newHotel = new Hotel({
            ...req.body,
            ...(featured && { featured: true }),
            photos: urls,
            coordinates
        });

        await newHotel.save();
        await sendMail(newHotel, transporter);
        res.status(200).json(newHotel);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.createHotels = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an Array!" });
        }

        const insertedHotels = await Hotel.insertMany(req.body);
        res.status(200).json(insertedHotels);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getFeaturedHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find({ featured: req.query.featured }).limit(req.query.limit);
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getAllHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.deleteHotel = async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        // console.log(hotelId);
        const hotel = await Hotel.findById(hotelId);
        // console.log(hotel);
        const hotelImages = hotel.photos;
        // https://res.cloudinary.com/drq6qjbpg/image/upload/v1697729337/ReservationApp/Mumbai.jpg
        const options = {
            resource_type: "image"
        };

        await Promise.all(hotelImages.map(async (img) => {
            const arr = img.split("/");
            const str = arr.splice(arr.indexOf("ReservationApp")).join("/");
            const public_id = str.split(".")[0];
            console.log(public_id);
            await deleteImageFromCloudinary(public_id, options);
        }));

        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
        res.status(200).json(deletedHotel);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.upadateHotel = async (req, res, next) => {
    const { name, type, city, address, distance, desc, rating, cheapestPrice, featured } = req.body;
    const images = req.files;

    const { CITY, NAME } = req.query;

    try {
        if (images) {
            // console.log(images);
            var urls = [];

            const options = {
                resource_type: 'image',
                folder: `ReservationApp/Hotels/${CITY}/${NAME}`,
                stream: true
            };

            for (const img of images) {
                const url = await uploadToCloudinary(img, options);
                await urls.push(url);
            }
        }

        const dataToBeUpdated = {
            ...(name && { name }),
            ...(type && { type }),
            ...(city && { city }),
            ...(address && { address }),
            ...(distance && { distance }),
            ...(desc && { desc }),
            ...(rating && { rating }),
            ...(cheapestPrice && { cheapestPrice }),
            ...(featured && { featured })
        };

        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $push: { photos: { $each: urls } }, $set: dataToBeUpdated }, { new: true });
        res.status(200).json(updatedHotel);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteHotelImage = async (req, res, next) => {
    try {
        const { id, public_id, image_id } = req.query;

        const options = {
            resource_type: "image"
        };

        await deleteImageFromCloudinary(public_id, options);

        const hotel = await Hotel.findById(id);
        const getImgUrl = () => new Promise((resolve, reject) => {
            const img_urls = hotel.photos;

            const newArray = img_urls.filter((url) => url.split('/')[6] === image_id);

            resolve(newArray);
        });

        const urlToBeDeleted = await getImgUrl();
        console.log(urlToBeDeleted);
        const updatedDoc = await Hotel.findByIdAndUpdate(id, { $pull: { photos: { $in: urlToBeDeleted } } }, { new: true });
        res.status(200).json(updatedDoc);
    } catch (error) {
        next(error);
    }
}

module.exports.getFeatured = async (req, res, next) => {
    try {
        const featuredHotels = await Hotel.find({ featured: true });
        const count = {};

        featuredHotels.forEach(item => {
            const location = item.city;

            if (!count.hasOwnProperty(location)) {
                count[location] = {
                    count: 1,
                    image: item.photos[0]
                };
            } else {
                count[location].count += 1;
            }
        });
        // featuredHotels.push(count);
        res.json(count);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.countByType = async (req, res, next) => {
    try {
        const hotels = await Hotel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1
                    },
                    image: {
                        $first: {
                            $arrayElemAt: ["$$ROOT.photos", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    image: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
}

module.exports.getDistance = async (req, res, next) => {
    try {
        console.log(req.query);
        const { city } = req.query;
        const hotels = await Hotel.find({ city });
        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
}

module.exports.getRoomsByHotelId = async (req, res, next) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);
        console.log(hotel);
        const Roomlist = await Promise.all(hotel.rooms.map((room) => {
            return Room.findById(room);
        }));
        console.log(Roomlist);
        res.status(200).json(Roomlist);
    } catch (error) {
        next(error);
    }
}

module.exports.updateRoom = async (req, res, next) => {
    try {
        const { id, roomNumber, startDate, endDate, roomid } = req.query;
        const hotel = await Hotel.findById(id);
        let roomAvailable = await Array.from(hotel.rooms).includes(roomid);

        if (!roomAvailable) {
            return next(createError(404, "something went wrong while checking for the room please try later!"));
        }

        const room = await Room.findById(roomid);
        let unavailableDates = await room.roomNumbers.find(obj => obj.number == roomNumber)['unavailableDates'];
        console.log(unavailableDates);
        // console.log(unavailableDates['unavailableDates']);
        let start = new Date(startDate);
        let end = new Date(endDate);

        for (let date = new Date(start); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
            unavailableDates.push(date.toISOString());
        }

        const updatedRoom = await room.save();
        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error(error);
        next(error);
    }
}


module.exports.getImages = async (req, res, next) => {
    try {
        const updatedDocuments = [];

        const data = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'ReservationApp'
        });

        for (const resource of data.resources) {
            const location = resource.public_id.split('/').pop();
            try {
                await Hotel.updateMany(
                    { city: location },
                    { $push: { photos: resource.secure_url } }
                );

                const updatedDocs = await Hotel.find({ city: location });
                if (updatedDocs.length > 0) {
                    updatedDocuments.push(...updatedDocs);
                }
            } catch (err) {
                console.error(err);
            }
        }

        res.json({ updateResults: updatedDocuments });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports.getByPropertyType = async (req, res, next) => {
    const { type, search } = req.query;
    try {
        let match = {
            type
        };

        if (search) {
            match.address = {
                $regex: new RegExp(search, "i")
            }
        }

        const properties = await Hotel.aggregate([{ $match: match }]);
        console.log(properties);
        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
}

module.exports.getNumberOfPhotos = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();

        const countPhotosByLocation = {};

        hotels.forEach((hotel) => {
            if (!countPhotosByLocation.hasOwnProperty(hotel.city)) {
                countPhotosByLocation[hotel.city] = hotel.photos.length;
            } else {
                countPhotosByLocation[hotel.city] += hotel.photos.length;
            }
        });

        res.status(200).json(countPhotosByLocation);
    } catch (error) {
        next(error);
    }
}

module.exports.getSuggestions = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || !req.query || query == undefined) {
            return res.status(200).json([]);
        }

        const hotels = await Hotel.find();

        const getSearchResults = async (hotels, query) => {
            const result = [];

            const getDataObject = (hotel, query) => {
                let i = 0;
                let prev = -1;
                let matchObj = {
                    hotel,
                    count: 0
                };

                let address = hotel.address.toLowerCase();
                query = query.toLowerCase();

                for (let j = 1; j <= query.length; j++) {
                    if (query[j - 1] == " " || j == query.length) {
                        let match = query.substring(i, j == query.length ? j : j - 1);
                        let flag = false;
                        let k = 0;
                        for (; k <= address.length - match.length; k++) {
                            let l = 0;
                            for (; l < match.length; l++) {
                                if (match[l] !== address[k + l]) {
                                    break;
                                }
                            }

                            if (l == match.length) {
                                if (k > prev) {
                                    prev = k;
                                    matchObj.count++;
                                } else {
                                    flag = true;
                                    delete matchObj.count;
                                }
                                break;
                            }
                        }

                        if (k > address.length - match.length || flag) {
                            delete matchObj.count;
                            break;
                        }
                        i = j;
                    }
                }

                return matchObj.count ? matchObj : null;
            }

            for (const [index, hotel] of hotels.entries()) {
                let matchObj = getDataObject(hotel, query);
                if (matchObj !== null) result.push(matchObj);
            }

            const getSortedResult = async (result) => {
                result.sort((a, b) => {
                    if (a.count !== b.count) {
                        return b.count - a.count;
                    }

                    return a.hotel.name.localeCompare(b.hotel.name);
                });

                return result;
            }

            return await getSortedResult(result);
        }

        const searchResult = await getSearchResults(hotels, query);
        console.log("result Array ", searchResult);

        res.status(200).json(searchResult);
    } catch (error) {
        next(error);
    }
}

