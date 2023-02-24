const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    profilePhoto: String,
    password: String,
}, { timestamps: true,  collection: 'Users' });

const User = mongoose.model('user', userSchema);

module.exports = User;