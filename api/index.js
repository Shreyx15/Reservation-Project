const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
var bodyParser = require('body-parser');
const firebase_admin = require('firebase-admin');
const path = require('path');
//MONGODB CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};

//MIDDLEWARES
express.urlencoded({ extended: true });
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//ROUTES IMPORT
const hotelRoutes = require('./routes/hotels');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const usersRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');
//ROUTES CONFIG
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({
        status: err.status,
        message: err.message
    });
});

//SERVER
app.listen(8000, function () {
    console.log("server!");
});