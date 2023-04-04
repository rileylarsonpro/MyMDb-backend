const express = require(`express`);
const router = express.Router();
const logController = require(`../controllers/log.controller`)
const { validateLogTvEpisode, handleTags } = require(`../middleware/log.middleware`)



router.post(`/episode`, validateLogTvEpisode, handleTags, logController.logEpisode);


module.exports = router