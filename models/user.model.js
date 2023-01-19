const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    email: String,
    googleId: String,
    googlePhoto: String,
    googleName: String
}, { collection: 'Users' });

const User = mongoose.model('user', userSchema);

module.exports = User;