const { Double } = require('mongodb');
const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    name: {
        type: String,
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
        maxlength: 250,
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
        required: false
    },
    cheapestPrice: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function (val) {
                // latitude is between -90 and 90, and longitude is between -180 and 180
                return Array.isArray(val) && val.length === 2 &&
                    val[0] >= -90 && val[0] <= 90 &&
                    val[1] >= -180 && val[1] <= 180;
            },
            message: props => `${props.value} is not a valid latitude-longitude pair!`
        }

    }
});



// hotelSchema.pre('save', async function (next) {
//     const hotel = this;
//     console.log(hotel);
//     const query = encodeURIComponent(`${hotel.name}, ${hotel.city}`);
//     const uri = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}`;

//     try {
//         const res = await fetch(uri);
//         const data = await res.json();

//         if (res.ok) {
//             const { lat, lon } = data[0];
//             this.coordinates = [parseFloat(lat), parseFloat(lon)];
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// });


module.exports = mongoose.model('Hotel', hotelSchema);