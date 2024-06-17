const cloudinary = require('cloudinary').v2;
const { log } = require('console');
const { model } = require('mongoose');
const { resolve } = require('path');
const { Readable, pipeline } = require('stream');


module.exports.uploadToCloudinary = (file, options, res) => new Promise(async (resolve) => {

    options.public_id = file.originalname.slice(0, -4);
    // console.log(typeof file.originalname + "lamo ");
    // console.log(file.originalname.slice(0, -4));
    const fileStream = await cloudinary.uploader.upload_stream(options, (error, response) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }

        resolve(response.secure_url);
    });

    const str = Readable.from(file.buffer);
    str.pipe(fileStream);
});


module.exports.deleteImageFromCloudinary = (public_id, options) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, options)
            .then((response) => {
                console.log("photo deleted successfully!");
                resolve(response);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });

}