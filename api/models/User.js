const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: function (username) {
                if (username.length < 3 || username.length > 20) {
                    return false;
                } else if (/^\d/.test(username)) {
                    return false;
                }
                return true;
            },
            message: (props) => {
                if (props.length < 3 || props.length > 20) {
                    return "Username length should be between 3 to 20 characters!";
                } else if (!/^\d/.test(props)) {
                    return "Username cannot start with a digit!";
                }
                return "Username not valid!";
            }
        }
        ,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) && email.length >= 5 && email.length <= 50;
            },
            message: (props) => {
                if (props.length < 3 || props.length > 50) {
                    return "email length should be between 3 to 20 characters!"
                }
                return "Email not valid!";
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (password) {
                return /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(password);
            },
            message: "Password not valid!"
        }
    },
    img: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: Number,
        required: true
    },
    country: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bookings: {
        type: [
            {
                id: String,
                hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
                bookedRooms: [{
                    id: String,
                    roomNumbers: [Number]
                }],
                from: {
                    type: Date
                },
                to: {
                    type: Date
                }
            }
        ],
        required: true,
        default: []
    }
}, { timestamps: true });


const subscriptionSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);
const SubscribedUser = mongoose.model('SubscribedUser', subscriptionSchema);

module.exports = { User, SubscribedUser };