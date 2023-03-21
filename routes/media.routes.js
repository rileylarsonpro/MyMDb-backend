const express = require(`express`);
const router = express.Router();
const mediaController = require(`../controllers/media.controller`)



router.get(`/search/multi`, mediaController.searchMulti)


module.exports = router