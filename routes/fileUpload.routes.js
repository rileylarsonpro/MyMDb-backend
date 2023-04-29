const express = require(`express`);
const router = express.Router();
const {uploadFilesMiddleware} = require(`../middleware/fileUpload.middleware`);
const fileUploadController = require(`../controllers/fileUpload.controller`);
const { hasUser } = require(`../middleware/hasUser`)

router.post(`/profile-picture`, hasUser, uploadFilesMiddleware, fileUploadController.uploadFile);

router.get(`/:name`, fileUploadController.downloadFile);

router.delete(`/:name`, hasUser, fileUploadController.deleteFile);

module.exports = router;