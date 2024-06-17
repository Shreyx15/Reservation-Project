const { User } = require("../models/User");
const nodemailer = require('nodemailer');


module.exports.sendMail = async (newHotel, transporter) => {

    const users = await User.find();
    console.log(users);
    for (const user of users) {
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: user.email,
            subject: 'New Hotel now available',
            text: `A new hotel has been added to our website:\n\n
            Hotel Name: ${newHotel.name}\n
            City: ${newHotel.city}\n
            Address: ${newHotel.address}\n  
            Description: ${newHotel.desc}`,
            html: `<p>A new hotel has been added to our database:</p>
            <ul>
                <li><strong>Hotel Name:</strong> ${newHotel.name}</li>
                <li><strong>City:</strong> ${newHotel.city}</li>
                <li><strong>Address:</strong> ${newHotel.address}</li>
                <li><strong>Description:</strong> ${newHotel.desc}</li>
            </ul>
      
            <!-- Add more images as needed -->
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }
        });

    }
}


module.exports.sendOTPMail = async (email, title, body) => {
    try {
        // Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: title,
            html: body,
        };

        let info = await transporter.sendMail(mailOptions);
        // console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};

