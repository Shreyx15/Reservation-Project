const router = require('express').Router();
const { createUser, createUsers, updateUser, deleteUser, getUser, getAllUsers, addSubscription, updateBookings, cancelUserBooking, getUserBookings } = require('../controllers/user');
const { verifyToken, verifyUser, verifyAdmin } = require('../utils/verifyToken');
const multer = require('multer');

router.get("/checkAuthentication", verifyToken, (req, res, next) => {
    res.send("you are authenticated!");
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB (for individual files)
        fieldSize: 10 * 1024 * 1024 // 10 MB (for text fields)
    }
});


router.post("/register", [verifyToken, verifyAdmin], upload.single('image'), createUser);

router.post("/insertMany", verifyToken, createUsers);

router.put("/updateUser", [verifyToken, verifyAdmin], upload.single('image'), updateUser);

router.delete("/:id", [verifyToken, verifyAdmin], deleteUser);

router.get("/:id", verifyToken, getUser);

router.get("/", verifyToken, getAllUsers);

router.post("/addSubscription", verifyToken, addSubscription);

router.put("/update_bookings", verifyToken, updateBookings);

router.get("/bookings/getUserBookings/:id", verifyToken, getUserBookings);

router.delete("/bookings/cancelUserBooking/:userId/:bookingId", cancelUserBooking);

module.exports = router;