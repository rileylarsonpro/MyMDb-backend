const express = require(`express`);
const router = express.Router();
const mediaController = require(`../controllers/media.controller`)



router.get(`/search/:itemType`, mediaController.searchMulti)

router.get(`/details/:mediaType/:id`, mediaController.getDetails)


module.exports = router