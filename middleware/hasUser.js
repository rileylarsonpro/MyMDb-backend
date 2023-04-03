const { admin } = require("../config/firebase.config.js");
const User = require("../models/user.model.js");

exports.hasUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async function (decodedToken) {
        try {
            let user = await User.findOne({ firebaseId: decodedToken.uid });
            req.user = user;
            return next();
        } catch (error) {
            console.log(error);
        return res.sendStatus(403);
        }
      })
      .catch(function (error) {
        console.log(error);
        return res.sendStatus(403);
      });
  } else {
    res.sendStatus(401);
  }
};
