//create new router
const express = require(`express`)
const router = express.Router()

//require passport
const passport = require('passport')


//require authenticate method
const { authenticate } = require(`../middleware/authenticated`)

//Route that sends to gogole to authenticate 
router.get('/google',
    passport.authenticate('google', { scope: [`https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`] }));

//callback function
router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
    //This tries to save the session, and if it fails it makes sure the passport session is deleted via req.logout()
    req.session.save(err => {
        if (err) {
          req.logout()
          res.sendStatus(500)
        }
        else res.redirect(process.env.CLIENT_ORIGIN)
      })
    })
//log out Route
router.get(`/logout`, async (req,res) => {
    //distroy session in two ways
    req.session.destroy()
    req.logout()
    res.redirect(process.env.CLIENT_ORIGIN)
  })

//check if user is logged in
router.get(`/user`, authenticate, (req, res) => {
    res.send(req.user)
})
module.exports = router