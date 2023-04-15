const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    logType: {
        type: String,
        enum: ['MOVIE', 'TV_SHOW', 'TV_SEASON', 'TV_EPISODE'],
        required: true
    },
    dateWatched: {
        type: Date,
        default: null
    },
    liked: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewText: {
        type: String,
        default: ""
    },
    isReview: {
        type: Boolean,
        default: false
    },
    noteText: {
        type: String,
        default: ""
    },
    isNote: {
        type: Boolean,
    },
    isRewatch: {
        type: Boolean,
        default: false
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    containsSpoilers: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: 'tag',
        default: []
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    tvShow: {
        type: {
            name: String,
            tmdbShowId: Number,
            poster: String,
            startDate: Date,
            endDate: Date,
            status: String,
            seasons: Number,
            episodes: Number,
        },
        default: null
    },
    tvSeason: {
        type: {
            name: String,
            season : Number,
            showName: String,
            tmdbShowId: Number,
            poster: String,
            airDate : Date,
        },
        default: null
    },
    tvEpisode: {
        type: {
            name: String,
            season : Number,
            episode: Number,
            showName: String,
            tmdbShowId: Number,
            tmdbEpisodeId: Number,
            poster: String,
            airDate : Date,
        },
        default: null
    }, 
    movie: {
        type: {
            name: String,
            tmdbMovieId: Number,
            poster: String,
            releaseDate: Date,
            runtime: Number,
        },
        default: null
    },

}, { timestamps: true,  collection: 'Logs' });



module.exports = mongoose.model('log', logSchema);