const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { createError } = require("../utils/error");
const { uploadToCloudinary, deleteImageFromCloudinary } = require("./cloudinary");

module.exports.createRoom = async (req, res, next) => {
    try {
        const image = req.file;
        // console.log(image);
        // console.log(req.body);
        // req.file.originalname;
        // console.log(req.file.originalname.split('.')[0]);
        const options = {
            resource_type: 'image',
            folder: `ReservationApp/Rooms`,
            public_id: req.file.originalname.split('.')[0],
            stream: true
        };
        const imgURL = await uploadToCloudinary(image, options);

        const body = {
            ...req.body,
            img: imgURL
        };

        const newRoom = new Room(body);
        const savedRoom = await newRoom.save();
        res.status(200).json(savedRoom);
    } catch (error) {
        next(error);
    }
}


module.exports.createRooms = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an Array!" });
        }

        const insertedRooms = await Room.insertMany(req.body);
        res.status(200).json(insertedRooms);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getSelectedRooms = async (req, res, next) => {
    try {
        // const { roomIds } = req.query;

        // console.log(req.body);
        const { data: roomIds } = req.body;

        const rooms = await Room.find({ _id: { $in: roomIds } });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteRoom = async (req, res, next) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json("Room deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.upadateRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { public_id } = req.query;

        const image = req.file;
        let imgURL;

        if (image) {
            const options = {
                resource_type: 'image',
                folder: "ReservationApp/Rooms",
            };

            await deleteImageFromCloudinary(public_id, options);

            options.stream = true;
            imgURL = await uploadToCloudinary(image, options);
        }

        const updateObj = {
            ...req.body,
            roomNumbers: JSON.parse(req.body.roomNumbers)
        };

        if (imgURL) {
            updateObj.img = imgURL;
        }

        console.log(req.body);
        const updatedRoom = await Room.findByIdAndUpdate(roomId, { $set: updateObj });
        res.status(200).json(updatedRoom);
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports.assignHotel = async (req, res, next) => {
    try {
        const { hotelId, roomData } = req.body.data;


        // console.log(roomData);
        let response = {};

        const getDataForUpdate = () => new Promise((resolve) => {
            const roomIds = [];
            const rooms = [];

            for (const room of roomData) {
                roomIds.push(room.id);

                let numbers = room.roomNumbers;
                let roomNumberObj = {
                    id: room.id,
                    roomNumbers: []
                };

                for (const rn of numbers) {
                    roomNumberObj.roomNumbers.push({
                        number: rn
                    });
                }
                rooms.push(roomNumberObj);
            }

            resolve({ roomIds, rooms });
        });

        const { roomIds, rooms } = await getDataForUpdate();

        console.log(roomIds, rooms);

        const updatedRooms = await Promise.all(rooms.map((room) => Room.findByIdAndUpdate(room.id, { $set: { associatedHotel: hotelId }, $push: { roomNumbers: { $each: room.roomNumbers } } }, { new: true })));
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, { $set: { rooms: roomIds } });

        response = {
            updatedRooms,
            updatedHotel
        };

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}