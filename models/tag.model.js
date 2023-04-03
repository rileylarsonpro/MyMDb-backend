const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, { timestamps: true,  collection: 'Tags' });

const Tag = mongoose.model('tag', tagSchema);

module.exports = Tag;