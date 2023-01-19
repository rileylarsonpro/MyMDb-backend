const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user.model.js');

// This defines what will be in the session cookie
passport.serializeUser(function (user, done) {
  done(null, user)
})
// Find the user from the session and use result in callback function
passport.deserializeUser(async (user, done) => {
  try {
    done(null, user)
  } catch (error) {
    console.error(error)
    done(error.message)
  }
})

// Here you will set up a connection to Google using variables from your .env file
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK_PATH}`,
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      await User.findOne({ googleId: profile.id }).then((currentUser) => {
        console.log(profile)
        if (currentUser) {
          // already have this user
          console.log('user is: ', currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
            googlePhoto: profile.photos[0].value,
            googleName: profile.displayName
          }).save().then((newUser) => {
            console.log('created new user: ', newUser);
            done(null, newUser);
          });
        }
      })
    } catch (error) {
      done(error)
    }
  }
));

// Initilize Session storage in MongoDB
const initStore = session => {
  const MongoDbStore = require(`connect-mongodb-session`)(session)
  const store = new MongoDbStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: `Sessions`,
  }, err => {
    if (err) console.error(err)
    else console.log(`Session Store Initialized`)
  })
  store.on(`error`, console.error)
  return store
}

module.exports = initStore