"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebase_config_1 = __importDefault(require("../config/firebase.config"));
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const idToken = authHeader.split(" ")[1];
        firebase_config_1.default
            .auth()
            .verifyIdToken(idToken)
            .then(function (decodedToken) {
            req.user = decodedToken;
            return next();
        })
            .catch(function (error) {
            console.log(error);
            return res.sendStatus(403);
        });
    }
    else {
        res.sendStatus(401);
    }
}
exports.authenticate = authenticate;
;
