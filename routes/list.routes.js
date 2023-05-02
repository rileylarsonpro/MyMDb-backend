const express = require(`express`);
const router = express.Router();
const listController = require(`../controllers/list.controller`);
const {
  validateCreateList,
  validateUpdateList,
  sanitizeDescriptionHTML,
} = require(`../middleware/list.middleware`);
const { handleTags } = require(`../middleware/tag.middleware`);


router.post(`/custom`, sanitizeDescriptionHTML, validateCreateList, handleTags, listController.createCustomList);

router.put(`/custom/:listId`, sanitizeDescriptionHTML, validateUpdateList, handleTags, listController.updateCustomList);

router.get(`/custom/:listId`, listController.getCustomList);

router.delete(`/custom/:listId`, listController.deleteCustomList);

router.get(`/custom`, listController.getCustomLists);







module.exports = router;
