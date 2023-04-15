const express = require(`express`);
const router = express.Router();
const logController = require(`../controllers/log.controller`)
const { validateLogTvEpisode,
        validateLogTvSeason, 
        validateLogTvShow, 
        validateLogMovie, 
        handleTags, 
        sanitizeLogHTML } = require(`../middleware/log.middleware`)



router.post(`/episode`, sanitizeLogHTML, validateLogTvEpisode, handleTags, logController.logEpisode);

router.post(`/season`, sanitizeLogHTML, validateLogTvSeason, handleTags, logController.logSeason);

router.post(`/show`, sanitizeLogHTML, validateLogTvShow, handleTags, logController.logShow);

router.post(`/movie`, sanitizeLogHTML, validateLogMovie, handleTags, logController.logMovie);


module.exports = router