const router = require('express').Router();
const { createRoom, createRooms, upadateRoom, deleteRoom, getRoom, getAllRooms, getRoomByHotelId } = require("../controllers/room");
const { verifyAdmin, verifyUser } = require("../utils/verifyToken");

router.post("/:hotelId", verifyAdmin, createRoom);

router.post("/insertMany", createRooms);

router.put("/:id", verifyAdmin, upadateRoom);

router.delete("/:id", verifyAdmin, deleteRoom);

router.get("/:id", getRoom);

router.get("/", getAllRooms);

module.exports = router;