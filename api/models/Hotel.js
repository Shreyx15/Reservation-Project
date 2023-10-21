const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: function (name) {
                return name.length >= 3 && name.length <= 20;
            },
            message: 'Name length must be between 3 to 20 characters'
        },
        required: true
    },
    type: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
    },
    city: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 25,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    photos: {
        type: [String]
    },
    desc: {
        type: String,
        minlength: 3,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    rooms: {
        type: [String],
        required: true
    },
    cheapestPrice: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Hotel', hotelSchema);