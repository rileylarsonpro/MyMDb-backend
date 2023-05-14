const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listItemSchema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'list',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    type: {
        type: String,
        enum: ['MOVIE', 'TV_SHOW', 'TV_SEASON', 'TV_EPISODE', 'CATEGORY', 'PERSON'],
        required: true
    },
    movie: {
        type: {
            name: String,
            tmdbMovieId: Number,
            poster: String,
            releaseDate: Date,
        }
    },
    tvShow: {
        type: {
            name: String,
            tmdbShowId: Number,
            poster: String,
            startDate: Date,
            endDate: Date,
            status: String,
        }
    },
    tvSeason: {
        type: {
            name: String,
            showName: String,
            season: Number,
            tmdbShowId: Number,
            poster: String,
            airDate: Date,
        }
    },
    tvEpisode: {
        type: {
            name: String,
            showName: String,
            season: Number,
            episode: Number,
            tmdbShowId: Number,
            tmdbEpisodeId: Number,
            poster: String,
            airDate: Date,
        }
    },
    category: {
        type: {
            listId: {
                type: Schema.Types.ObjectId,
                ref: 'list',
            }
        }
    },
    person: {
        type: {
            name: String,
            tmdbPersonId: Number,
            poster: String,
        }
    },
    rank: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true,  collection: 'ListItems' });

module.exports = mongoose.model('listItem', listItemSchema);