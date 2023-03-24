"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// See if email or username already exists
exports.checkForAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.email || !req.query.username) {
            return res.status(400).send({
                message: "Email and Username can not be empty"
            });
        }
        let user = yield User.findOne({ username: { $regex: new RegExp(`^${req.query.username}$`, "i") } }); // case insensitive
        if (user) {
            return res.status(200).send({ accountExists: true, message: "Username already taken" });
        }
        user = yield User.findOne({ email: { $regex: new RegExp(`^${req.query.email}$`, "i") } }); // case insensitive
        if (user) {
            return res.status(200).send({ accountExists: true, message: "Account already exists" });
        }
        return res.status(200).send({ accountExists: false, message: "Account does not exist" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error checking for user"
        });
    }
});
// Create and Save a new User
exports.createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request
        if (!req.body.email || !req.body.username) {
            return res.status(400).send({
                message: "Email and Username can not be empty"
            });
        }
        // Create a User
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            firebaseId: req.user.uid
        });
        // Save User in the database
        yield user.save();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error creating user"
        });
    }
});
