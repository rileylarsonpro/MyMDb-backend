const mongoose = require('mongoose');
const User = require("../models/user.model.js");

exports.uploadFile = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { profilePicture: `/${req.user._id}-profile-picture` });

        if (req.file == undefined) {
            return res.send({
                message: "You must select a file.",
            });
        }

        return res.send({
            message: "File has been uploaded.",
        });
    } catch (error) {
        console.log(error);
        return res.send({
            message: `Error when trying upload image: ${error}`,
        });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'photos'
        });

        // user gridFSBucket to send in src of img tag
        
        let downloadStream = gridFSBucket.openDownloadStreamByName(req.params.name);
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message,
        });
    }
};
