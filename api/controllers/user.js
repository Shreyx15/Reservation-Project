const { User } = require("../models/User");
const { SubscribedUser } = require("../models/User");

module.exports.createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        res.status(200).json(await newUser.save());
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.createUsers = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an Array!" });
        }

        const insertedUsers = await User.insertMany(req.body);
        res.status(200).json(insertedUsers);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.upadateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports.addSubscription = async (req, res, next) => {
    try {
        const newSub = await new SubscribedUser(req.body);
        await newSub.save();

        res.status(200).json(newSub);
    } catch (error) {
        next();
    }
}