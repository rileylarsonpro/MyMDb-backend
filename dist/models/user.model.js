"use strict";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    email: String,
    firebaseId: String
}, { timestamps: true, collection: 'Users' });
const User = mongoose.model('user', userSchema);
module.exports = User;
