const Log = require('../models/log.model');
const { LogTypes } = require('../utils/types');
const tmdb = require('../utils/tmdb');


exports.logEpisode = async (req, res) => {
    try {
        //run these in parallel
        let [{data: episode}, {data: show}] = await Promise.all([
            tmdb.getTvEpisodeDetails(req.body.tvShowId, req.body.tvSeason, req.body.tvEpisode, "&append_to_response=show_"),
            tmdb.getDetails("tv", req.body.tvShowId)
        ]);
        let log = req.body;
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
                name: episode.name,
                season: episode.season_number,
                episode: episode.episode_number,
                showName: show.name,
                tmdbShowId: req.body.tvShowId,
                tmdbEpisodeId: episode.id,
                poster: episode.still_path,
                airDate: episode.air_date,
            }
        });
        await episodeLog.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

