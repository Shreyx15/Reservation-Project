const { createHotel, createHotels, upadateHotel, deleteHotel, getHotel, getAllHotels, countByType, getHotelsByCity, getRoomsByHotelId, updateRoom, getFeatured, getImages } = require("../controllers/hotel");
const Hotel = require("../models/Hotel");
const { createError } = require("../utils/error");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const router = require('express').Router();

router.post("/", createHotel);

router.post("/insertMany", createHotels);

router.put("/update/:id", verifyAdmin, upadateHotel);

router.delete("/:id", verifyAdmin, deleteHotel);

router.get("/find/:id", getHotel);

router.get("/", getAllHotels);

router.get("/getFeatured", verifyToken, getFeatured);

router.get("/countByType", verifyToken, countByType);

router.get("/getHotelsByCity", verifyToken, getHotelsByCity);

router.get("/room/:id", verifyToken, getRoomsByHotelId);

router.put('/book', verifyToken, updateRoom);

router.get('/getImages', getImages);

module.exports = router;