const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true
    },
    desc: {
        type: String,  
        required: true
    },
    img: {
        type: String,
        required: true
    },
    roomNumbers: [
        {
            number: Number,
            unavailableDates: { type: [Date], default: [] }
        }
    ],
    associatedHotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Room', RoomSchema);