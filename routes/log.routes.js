const express = require(`express`);
const router = express.Router();
const logController = require(`../controllers/log.controller`)



router.post(`/episodes`, logController.logEpisodes);


module.exports = router