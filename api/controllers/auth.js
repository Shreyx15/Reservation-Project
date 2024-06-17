const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');
const { admin } = require('../config/Firebase');
const otpGenerator = require('otp-generator');
const OTP = require('../models/Otp');

module.exports.register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const { username, email } = req.body;

    if (await User.findOne({ username }) || await User.findOne({ email })) {
        return next(createError(500, "User Already Exists! Try Choosing different username OR Email."));
    }

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
        if (req.body.isGoogleLogin) {
            const { user } = req.body;
            req.session.user = user;
            req.session.save();
            res.json({ user });
            return;
        }

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return next(createError(404, "User not found!"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Password not correct!"));
        }

        const data = {
            id: user._id,
            isAdmin: user.isAdmin
        };

        const token = jwt.sign(data, process.env.JWT, { expiresIn: '1h' });
        req.session.user = user._id;
        req.session.save();

        const response = {
            user, token
        };

        res.cookie('access_token', token, {
            secure: true
        }).status(200).json(response);
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
            if (!req.body.isGoogleLogin) {
                res.clearCookie("access_token");
            }
            res.clearCookie("connect.sid");
            res.status(200).send("logged out succesfully!");
        });

    } catch (error) {
        next();
    }
}

module.exports.clearSession = async () => {
    try {
        req.session.destroy((err) => {
            if (!req.body.isGoogleLogin) {
                res.clearCookie("access_token");
            }
            res.clearCookie("connect.sid");
            res.status(200).send("Session cleared Successfully!");
        });
    } catch (error) {
        next(createError(501, "Error while clearing Session!"));
    }
}

module.exports.checkAuth = async (req, res, next) => {
    let isLoggedIn = false;

    let token = req.cookies.access_token || req.body.token || req.headers.Authorization;

    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    if (req.body.isGoogleLogin) {
        try {

            const decodedToken = await admin.auth().verifyIdToken(token);
            isLoggedIn = true;
            res.status(200).json({ isLoggedIn, token });
        } catch (error) {
            console.error(error);
            isLoggedIn = false;
            res.status(200).json({ isLoggedIn });
        }
    } else {
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) {
                res.status(200).json({ isLoggedIn, token });
            } else {
                req.user = user;
                isLoggedIn = true;
                res.status(200).json({ isLoggedIn, token });
            }
        });
    }

}

module.exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User is already registered',
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let result = await OTP.findOne({ otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: true,
            });
            result = await OTP.findOne({ otp });
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};


module.exports.verifyOTP = async (req, res, next) => {
    try {

        const { email, otp } = req.body;
        console.log("email comes here", req.body);
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("sorted array: ", response);

        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

