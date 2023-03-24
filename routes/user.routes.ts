const router = require('express').Router()
const userController = require(`../controllers/user.controller`)
const { authenticate } = require(`../middleware/authenticated`)


// check if user is logged in
router.get(`/`, authenticate, (req, res) => {
    res.send(req.user)
})

router.get(`/check-for-account`, userController.checkForAccount)

router.post(`/create-account`, authenticate, userController.createAccount)


export default router