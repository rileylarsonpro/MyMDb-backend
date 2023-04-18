const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    firebaseId: String,
    profilePicture: {
        type: String,
        default: ''
    },
}, { timestamps: true,  collection: 'Users' });

const User = mongoose.model('user', userSchema);

module.exports = User;