const router = require('express').Router()
const mediaController = require(`../controllers/media.controller`)


router.get(`/search/multi`, mediaController.searchMulti)


export default router