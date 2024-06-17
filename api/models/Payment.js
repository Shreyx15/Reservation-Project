const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
