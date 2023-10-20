const router = require('express').Router();
const { createUser, createUsers, upadateUser, deleteUser, getUser, getAllUsers, addSubscription } = require('../controllers/user');
const { verifyToken, verifyUser, verifyAdmin } = require('../utils/verifyToken');

router.get("/checkAuthentication", verifyToken, (req, res, next) => {
    res.send("you are authenticated!");
});

//REGISTER USER
router.post("/", createUser);

//POST USERS ARRAY
router.post("/insertMany", createUsers);

//UPDATE USER
router.put("/:id", verifyUser, upadateUser);

//DELETE USER
router.delete("/:id", verifyUser, deleteUser);

//GET USER
router.get("/:id", verifyUser, getUser);

//GET ALL THE USERS
router.get("/", verifyAdmin, getAllUsers);

router.post("/addSubscription", addSubscription);

module.exports = router;