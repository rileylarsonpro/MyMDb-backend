const express = require(`express`);
const router = express.Router();
const { authenticate } = require(`../middleware/authenticated`)
const userController = require(`../controllers/user.controller`)



// check if user is logged in
router.get(`/`, authenticate, (req, res) => {
    res.send(req.user)
})

router.get(`/check-for-account`, userController.checkForAccount)

router.post(`/create-account`, authenticate, userController.createAccount)


module.exports = router