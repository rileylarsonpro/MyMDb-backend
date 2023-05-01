const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_CONNECTION_STRING,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, res, file) => {

    return {
      bucketName: "photos",
      filename: `${req.user._id}-profile-picture`,
    };
  },
});

let uploadFiles = multer({
  storage: storage,
  fileFilter: (request, file, callback) => {
    const acceptedTypes = file.mimetype.split("/");
    if (acceptedTypes[0] === "image") {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("Only images and videos formats allowed!"));
    }
  },
}).single("file");
exports.uploadFilesMiddleware = util.promisify(uploadFiles);
