const router = require('express').Router();
const { createRoom, createRooms, upadateRoom, deleteRoom, getRoom, getAllRooms, assignHotel, getSelectedRooms } = require("../controllers/room");
const { verifyAdmin, verifyUser, verifyToken } = require("../utils/verifyToken");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createRoom", [verifyToken, verifyAdmin], upload.single('image'), createRoom);

router.post("/insertMany", [verifyToken, verifyAdmin], createRooms);

router.post("/assignHotel", [verifyToken, verifyAdmin], assignHotel);

router.put("/:roomId", [verifyToken, verifyAdmin], upload.single('image'), upadateRoom);

router.delete("/:id", [verifyToken, verifyAdmin], deleteRoom);

router.get("/:id", verifyToken, getRoom);

router.get("/", verifyToken, getAllRooms);

router.post("/get_selected_rooms", [verifyToken, verifyAdmin], getSelectedRooms);

module.exports = router;