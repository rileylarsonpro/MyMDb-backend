"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require('firebase-admin');
require('dotenv').config();
// if no any env is not set throw error
if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error('FIREBASE_ADMIN_PRIVATE_KEY is not set');
}
if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error('FIREBASE_ADMIN_CLIENT_EMAIL is not set');
}
if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
    throw new Error('FIREBASE_ADMIN_PROJECT_ID is not set');
}
// code from: https://www.tonyvu.co/posts/jwt-authentication-node-js
admin.initializeApp({
    credential: admin.credential.cert({
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY[0] === "-"
            ? process.env.FIREBASE_ADMIN_PRIVATE_KEY
            : JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    })
});
exports.default = admin;
