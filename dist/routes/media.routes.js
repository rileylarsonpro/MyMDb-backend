"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const mediaController = require(`../controllers/media.controller`);
router.get(`/search/multi`, mediaController.searchMulti);
exports.default = router;
