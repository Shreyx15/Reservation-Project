const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
//MONGODB CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);


const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};
//MIDDLEWARES
app.use(express.json());
require('dotenv').config();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
//ROUTES IMPORT
const hotelRoutes = require('./routes/hotels');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const usersRoutes = require('./routes/users');

//ROUTES CONFIG
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/hotels", hotelRoutes);

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