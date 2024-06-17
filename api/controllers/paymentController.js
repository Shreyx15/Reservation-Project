const razorPay = require("razorpay");
const { v4: generateUUID } = require('uuid');
const Receipt = require('../models/Payment');

module.exports.handlePayment = async (req, res, next) => {
    let { amount } = req.body;
    amount = amount * 100;

    try {
        const instance = new razorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const generateUniqueReceiptNumber = async () => {
            let rid = generateUUID();

            while (true) {
                const receipt = await Receipt.findOne({ receiptNumber: rid });

                if (!receipt || receipt == undefined || receipt == null) {
                    break;
                }
                rid = generateUUID();
            }
            return rid;
        }

        const options = {
            amount,
            currency: "INR",
            receipt: await generateUniqueReceiptNumber(),
        };
        console.log("uuid", options.receipt);
        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        const update_receipt = await Receipt.create({ receiptNumber: options.receipt });
        update_receipt.save();

        res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
}

module.exports.paymentSuccess = (req, res, next) => {
    try {

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}