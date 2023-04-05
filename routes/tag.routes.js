const express = require(`express`);
const router = express.Router();
const tagController = require(`../controllers/tag.controller`)



router.get(`/user-tags`, tagController.getUserTags);


module.exports = router