const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    listType: {
        type: String,
        enum: ['FAVORITE_MOVIES', 'FAVORITE_TV_SHOWS', 'FAVORITE_PEOPLE', 'WATCHLIST', 'CUSTOM', 'OSCARS'],
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    allowedTypes: {
        type: [String],
        enum: ['MOVIE', 'TV_SHOW', 'TV_SEASON', 'TV_EPISODE', 'CATEGORY', 'PERSON'],
        default: []
    },
    excludedTypes: {
        type: [String],
        enum: ['MOVIE', 'TV_SHOW', 'TV_SEASON', 'TV_EPISODE', 'CATEGORY', 'PERSON'],
        default: []
    },
    maxSize: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    ranked: {
        type: Boolean,
        default: false
    },
    isCategory: {
        type: Boolean,
        default: false
    },
    categoryLabel: {
        type: String,
        enum: ['NONE', 'OSCAR'],
        default: "NONE"
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
}, { timestamps: true,  collection: 'Lists' });

module.exports = mongoose.model('list', listSchema);