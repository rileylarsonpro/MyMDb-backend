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

router.delete(`/:listId`, listController.deleteList);

router.get(`/user-lists`, listController.getUserLists);

router.get(`/:listId`, listController.getList);







module.exports = router;
