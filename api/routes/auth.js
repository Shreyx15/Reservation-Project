const { register, login, logout, checkAuth, sendOTP, verifyOTP } = require('../controllers/auth');
const { verifyToken } = require('../utils/verifyToken');
const router = require('express').Router();


router.post("/register", register);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

router.post('/checkAuthentication', checkAuth);

router.post('/mailVerification', sendOTP);

router.post('/verifyOTP', verifyOTP);

module.exports = router;