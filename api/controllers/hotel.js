const { json } = require("body-parser");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { createError } = require("../utils/error");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');



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
        pass: 'kusz kttw bjju wxvv'
    }
});

module.exports.createHotel = async (req, res, next) => {
    try {
        const newHotel = new Hotel(req.body);
        await newHotel.save();

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: process.env.NODEMAILER_USER,
            subject: 'New Hotel now available',
            text: `A new hotel has been added to our website:\n\n
            Hotel Name: ${newHotel.name}\n
            City: ${newHotel.city}\n
            Address: ${newHotel.address}\n
            Description: ${newHotel.desc}`,
            html: `<p>A new hotel has been added to our database:</p>
            <ul>
                <li><strong>Hotel Name:</strong> ${newHotel.name}</li>
                <li><strong>City:</strong> ${newHotel.city}</li>
                <li><strong>Address:</strong> ${newHotel.address}</li>
                <li><strong>Description:</strong> ${newHotel.desc}</li>
            </ul>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(info.response);
                const responseObj = {
                    emailResponse: info.response,
                    savedHotel: newHotel
                };
                res.status(200).json(responseObj);
            }
        });

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

module.exports.getAllHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find({ featured: req.query.featured }).limit(req.query.limit);
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.upadateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedHotel);
    } catch (err) {
        res.status(500).json(err);
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
        const hotels = await Hotel.countDocuments({ type: "Hotel" });
        const apartments = await Hotel.countDocuments({ type: "Apartment" });
        const resorts = await Hotel.countDocuments({ type: "Resort" });
        const villas = await Hotel.countDocuments({ type: "villas" });

        res.status(200).json([
            {
                type: "Hotel",
                count: hotels
            },
            {
                type: "Apartment",
                count: apartments
            },
            {
                type: "Resort",
                count: resorts
            },
            {
                type: "Villa",
                count: villas
            }
        ]);
    } catch (error) {
        next(error);
    }
}

module.exports.getHotelsByCity = async (req, res, next) => {
    try {
        const hotels = await Hotel.find(req.query);
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
        next();
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
        next();
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
        next();
    }
}

