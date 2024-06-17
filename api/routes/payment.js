const router = require('express').Router();
const { handlePayment, paymentSuccess } = require('../controllers/paymentController');
const { verifyToken, verifyUser, verifyAdmin } = require('../utils/verifyToken');
const { route } = require('./hotels');

router.post('/orders', handlePayment);

router.post('/success', paymentSuccess);

module.exports = router;