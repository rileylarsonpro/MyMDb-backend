const User = require('../models/user.model');

// See if email or username already exists
exports.checkForAccount = async (req, res) => {
    try {
        if (!req.query.email || !req.query.username) {
            return res.status(400).send({
                message: "Email and Username can not be empty"
            });
        }
        let user = await User.findOne( { username : { $regex : new RegExp(`^${req.query.username}$`, "i") } }) // case insensitive
        if (user) {
            return res.status(200).send({ accountExists: true, message: "Username already taken" });
        }
        user = await User.findOne( { email : { $regex : new RegExp(`^${req.query.email}$`, "i") } }) // case insensitive
        if (user) {
            return res.status(200).send({ accountExists: true, message: "Account already exists" });
        }
        return res.status(200).send({ accountExists: false, message: "Account does not exist" });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error checking for user"
        });
    }
};


// Create and Save a new User
exports.createAccount = async (req, res) => {
    try {
        // Validate request
        if (!req.body.email || !req.body.username ) {
            return res.status(400).send({
                message: "Email and Username can not be empty"
            });
        }

        // Create a User
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            firebaseId: req.user.uid,
            profilePicture: '',
            displayName: req.body.username
        });

        // Save User in the database
        await user.save()
        return res.status(200).send(user);
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error creating user"
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        return res.status(200).send(user);
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error getting user"
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (req.body.displayName === '') {
            return res.status(400).send({
                message: "Display name can not be empty"
            });
        }
        if (req.body.displayName) {
            user.displayName = req.body.displayName
        }
        await user.save();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error updating user"
        });
    }
}