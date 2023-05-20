const express = require(`express`);
const router = express.Router();
const { authenticate } = require(`../middleware/authenticated`)
const { hasUser } = require(`../middleware/hasUser`)
const userController = require(`../controllers/user.controller`)
const { sanitizeBioHTML } = require(`../middleware/user.middleware`)



// check if user is logged in
router.get(`/`, hasUser, (req, res) => {
    res.send(req.user)
})

router.get(`/check-for-account`, userController.checkForAccount)

router.post(`/create-account`, authenticate, userController.createAccount)

router.get(`/profile`, hasUser, userController.getProfile)

router.put(`/profile`, hasUser, sanitizeBioHTML, userController.updateProfile)


module.exports = router