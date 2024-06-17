const { createHotel, createHotels, upadateHotel, getHotel, countByType, getRoomsByHotelId, updateRoom, getFeatured, getImages, getByPropertyType, getNumberOfPhotos, deleteHotelImage, getFeaturedHotels, getAllHotels, deleteHotel, getSuggestions, getDistance } = require("../controllers/hotel");
const Hotel = require("../models/Hotel");
const { createError } = require("../utils/error");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const router = require('express').Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", [verifyToken, verifyAdmin], upload.array('images'), createHotel);

router.post("/insertMany", createHotels);

router.put("/update/:id", [verifyToken, verifyAdmin], upload.array('images'), upadateHotel);

router.delete("/deleteImage", [verifyToken, verifyAdmin], deleteHotelImage);

router.delete("/:hotelId", [verifyToken, verifyAdmin], deleteHotel);
// router.delete("/:id", verifyAdmin, deleteHotelImage);
router.get("/find/:id", verifyToken, getHotel);

router.get("/", verifyToken, getFeaturedHotels);

router.get("/getAllHotels", verifyToken, getAllHotels);

router.get("/getFeatured", verifyToken, getFeatured);

router.get("/countByType", verifyToken, countByType);

router.get("/getDistance", verifyToken, getDistance);

router.get("/room/:id", verifyToken, getRoomsByHotelId);

router.put('/book', verifyToken, updateRoom);

router.get('/getImages', verifyToken, getImages);

router.get('/getByPropertyType', verifyToken, getByPropertyType);

router.get('/countNumberOfPhotos', verifyToken, getNumberOfPhotos);

router.get('/getSearchResults', verifyToken, getSuggestions);

module.exports = router;