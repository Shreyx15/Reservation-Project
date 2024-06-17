const jwt = require('jsonwebtoken');
const { createError } = require('./error');
const { admin } = require('../config/Firebase');

module.exports.verifyToken = (req, res, next) => {
    let token = req.cookies.access_token || req.body.token || req.get('Authorization');

    // console.log("from headers: ", req.get('Authorization'));
    if (req.body.isGoogleLogin || req.query.isGoogleLogin) {
        token = req.get('Authorization');
    }

    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    const isGoogleLogin = req.body.isGoogleLogin || req.query.isGoogleLogin;

    if (isGoogleLogin === "true" || isGoogleLogin === true) {
        const verifyIdToken = async () => {
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                // console.log(decodedToken);
                next();
            } catch (error) {
                next(createError(403, "Token is not valid!"));
            }
        }

        verifyIdToken();
    } else {
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) {
                return next(createError(403, "Token is not valid!"));
            }

            req.user = user;
            next();
        });
    }
}

module.exports.verifyUser = (req, res, next) => {
    this.verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            if (err) {
                return next(createError(403, "You are not authorized!"));
            }
        }
    });
}

module.exports.verifyAdmin = (req, res, next) => {
    this.verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            if (err) {
                return next(createError(403, "You are not authorized!"));
            }
        }
    });
}