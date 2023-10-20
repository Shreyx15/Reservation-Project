const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { createError } = require("../utils/error");

module.exports.createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom._id } });
        } catch (error) {
            next(error);
        }

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
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedRoom);
    } catch (err) {
        res.status(500).json(err);
    }
}


