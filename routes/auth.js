const express = require(`express`);
const router = express.Router();

//check if user is logged in
router.get(`/user`, (req, res) => {
    res.send(req.user)
})


module.exports = router