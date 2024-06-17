const { User } = require("../models/User");
const { SubscribedUser } = require("../models/User");
const { uploadToCloudinary, deleteImageFromCloudinary } = require("../controllers/cloudinary");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable, pipeline } = require('stream');
const bcryptjs = require('bcryptjs');
const { resolve } = require("path");
const { error, log } = require("console");
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { useReducer } = require("react");

const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    private_cdn: false,
    secure_distribution: null,
    secure: true
};

cloudinary.config(config);

module.exports.createUser = async (req, res, next) => {
    const { username, email, password, city, phone, country } = req.body;
    let imgURL;
    console.log(req.body);
    console.log(req.file);

    try {
        console.log(req.body);
        console.log(req.file.buffer);

        console.log(req.body);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        } else {
            const options = {
                resource_type: 'image',
                folder: "ReservationApp/Users",
                public_id: req.file.originalname.slice(0, -4),
                stream: true
            };
            imgURL = await uploadToCloudinary(req.file, options);
        }

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        const newUser = new User({
            ...(username && { username }),
            ...(email && { email }),
            ...(password && { password: hash }),
            ...((req.file || imgURL) && { img: imgURL }),
            ...(city && { city }),
            ...(phone && { phone }),
            ...(country && { country }),
        });

        const savedUser = await newUser.save();
        console.log(imgURL);
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.createUsers = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an Array!" });
        }

        const insertedUsers = await User.insertMany(req.body);
        res.status(200).json(insertedUsers);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        const { img } = await User.findByIdAndDelete(req.params.id);
        // console.log(img);

        const options = {
            folder: "ReservationApp/Users"
        };
        const arr = img.split('/');
        const str = arr.splice(arr.indexOf('ReservationApp')).join('/');
        const dot_index = str.indexOf('.');
        const public_id = str.substring(0, dot_index);
        // console.log(public_id);

        await cloudinary.uploader.destroy(public_id, options);

        res.status(200).json("User deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.updateUser = async (req, res, next) => {
    const { username, email, password, city, phone, country, file, filename } = req.body;
    const { id, public_id } = req.query;
    let imgURL;

    console.log("user Data from client: ", id, public_id, req.body);

    try {
        console.log(filename);
        if (file) {
            const options = {
                resource_type: 'image',
                folder: "ReservationApp/Users",
            };

            if (public_id) {
                await deleteImageFromCloudinary(public_id, options);
            }

            options.public_id = filename.split('.')[0];


            await cloudinary.uploader.upload(file, options)
                .then((res) => {
                    imgURL = res.secure_url;
                })
                .catch((error) => {
                    console.error(error);
                });
        }


        let hash;
        if (password) {
            const salt = bcryptjs.genSaltSync(10);
            hash = bcryptjs.hashSync(password, salt);
        }

        const dataToBeUpdated = {
            ...(username && { username }),
            ...(email && { email }),
            ...(password && { password: hash }),
            ...((file || imgURL) && { img: imgURL }),
            ...(city && { city }),
            ...(phone && { phone }),
            ...(country && { country }),
        }

        const updatedUser = await User.findByIdAndUpdate(id, { $set: dataToBeUpdated }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports.addSubscription = async (req, res, next) => {
    try {
        const newSub = await new SubscribedUser(req.body);
        await newSub.save();

        res.status(200).json(newSub);
    } catch (error) {
        next();
    }
}

module.exports.updateBookings = async (req, res, next) => {
    const { data } = req.body;
    const { from, to, bookedRooms, hotelId, userId } = data;
    console.log("user data to be updated : ", data);
    try {
        const user = await User.findById(userId);
        // for (const [key, value] of Object.entries(data)) {
        //     console.log(`key : ${key}, value: ${JSON.stringify(value)}, type: ${typeof value}`);
        // }
        // console.log("USERID: ", userId);
        user.bookings.push({
            id: user.bookings.length + 1,
            hotelId,
            from: new Date(from),
            to: new Date(to),
            bookedRooms
        });

        user.save();
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
}

module.exports.getUserBookings = async (req, res, next) => {
    const { id } = req.params;
    console.log("user id on server side: ", id);
    try {
        const response = [];

        const user = await User.findById(id);
        const bookings = user.bookings;

        for (let booking of bookings) {
            const obj = {
                id: booking.id,
                hotel: await Hotel.findById(booking.hotelId),
                from: booking.from,
                to: booking.to
            };

            for (let room of booking.bookedRooms) {

                const r = await Room.findById(room.id);

                if (!obj.rooms) {
                    obj.rooms = [{ ...r, bookedRooms: [...room.roomNumbers] }];
                } else {
                    obj.rooms.push({ ...r, bookedRooms: [...room.roomNumbers] });
                }
            }

            response.push(obj);
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports.cancelUserBooking = async (req, res, next) => {
    const { userId, bookingId } = req.params;
    const response = {
        updatedUser: undefined,
        updatedRooms: []
    };

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const bookings = user.bookings;
        const index = bookings.findIndex(obj => obj.id == bookingId);
        if (index === -1) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const obj = bookings[index];

        // Create a new bookings array without the booking at the specified index
        const updatedBookings = [...bookings.splice(0, index), ...bookings.splice(1)];

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { bookings: updatedBookings } },
            { new: true }
        );

        response.updatedUser = updatedUser;
        const bookedRooms = obj?.bookedRooms || [];
        response.updatedRooms = [];

        const promises = bookedRooms.map(async (br) => {
            let room = await Room.findById(br.id);
            console.log(br);
            if (!room) {
                return; // Skip to the next iteration if room not found
            }

            for (let rn of br.roomNumbers) {
                const rn_obj = room.roomNumbers.find(ele => ele.number == rn);
                if (!rn_obj) {
                    continue; // Skip to the next room number if not found
                }
                console.log(br.from);
                const updatedDates = rn_obj.unavailableDates.filter(date => {
                    return !(new Date(date) >= new Date(obj.from) && new Date(date) <= new Date(obj.to));
                });


                const updatedRoom = await Room.findOneAndUpdate(
                    {
                        _id: br.id,
                        roomNumbers: {
                            $elemMatch: { number: rn }
                        }
                    },
                    {
                        $set: { 'roomNumbers.$[elem].unavailableDates': updatedDates }
                    },
                    {
                        new: true,
                        arrayFilters: [{ 'elem.number': rn }]
                    }
                );

                if (response.updatedRooms.findIndex((r) => r._id == updatedRoom._id) == -1) {
                    response.updatedRooms.push(updatedRoom);
                }
            }
        });

        await Promise.all(promises);


        res.status(200).json(response);  

    } catch (error) {
        throw new Error(error);
    }

}