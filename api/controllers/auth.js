const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    try {
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User has been created!");
    } catch (error) {
        next(error);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return next(createError(404, "User not found!"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Password not correct!"));
        }
        const JWT_KEY = "JWT secret for login";
        const data = {
            id: user._id,
            isAdmin: user.isAdmin
        };
        const token = jwt.sign(data, process.env.JWT, { expiresIn: '30m' });
        req.session.user = user._id;
        req.session.save();
        res.cookie('access_token', token, {
            secure: true
        }).status(200).json(user);
    } catch (error) {
        next(createError(400, "wrong password or username!"));
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return next(createError(400, "Error Logging out!"));
            }
            res.clearCookie("access_token");
            res.clearCookie("connect.sid");
            res.status(200).send("logged out succesfully!");
        });

    } catch (error) {
        next();
    }
}