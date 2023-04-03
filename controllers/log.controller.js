const Log = require('../models/log.model');
const { LogTypes } = require('../utils/types');


exports.logEpisodes = async (req, res) => {
    try {
        let episodes = req.body.episodes;
        episodes.forEach(async (log) => {
            const episodeLog = new Log( {
                logType: LogTypes.TV_EPISODE,
                dateWatched: log.dateWatched,
                liked: log.liked,
                rating: log.rating,
                reviewText: log.reviewText,
                isReview: (log.reviewText !== "") ? true : false,
                noteText: log.noteText,
                isNote: (log.noteText !== "") ? true : false,
                isRewatch: log.isRewatch,
                isPrivate: log.isPrivate,
                containsSpoilers: log.containsSpoilers,
                tags: log.tags, // TODO handle tags
                userId: req.user._id,
                tvEpisode: {
                    name: log.episode.name,
                    season: log.episode.season,
                    episode: log.episode.episode,
                    showName: log.episode.showName,
                    tmdbShowId: log.episode.tmdbShowId,
                    tmdbEpisodeId: log.episode.tmdbEpisodeId,
                    poster: log.episode.poster,
                    airDate: log.episode.airDate,
                }
            });
            await episodeLog.save();
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

