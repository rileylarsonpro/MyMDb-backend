const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require('dotenv').config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_CONNECTION_STRING,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${req.user._id}-profile-picture`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${req.user._id}-profile-picture`
    };
  }
});

let uploadFiles = multer({ storage: storage }).single("file");
exports.uploadFilesMiddleware = util.promisify(uploadFiles);

