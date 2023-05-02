const Log = require('../models/log.model');
const { LogTypes } = require('../utils/types');
const tmdb = require('../utils/tmdb');


exports.logEpisode = async (req, res) => {
    try {
        //run these in parallel
        let [{data: episode}, {data: show}] = await Promise.all([
            tmdb.getTvEpisodeDetails(req.body.tmdbShowId, req.body.season, req.body.episode),
            tmdb.getDetails("tv", req.body.tmdbShowId)
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
            tags: log.tags,
            userId: req.user._id,
            episode: {
                name: episode.name,
                season: episode.season_number,
                episode: episode.episode_number,
                showName: show.name,
                tmdbShowId: req.body.tmdbShowId,
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

exports.logSeason = async (req, res) => {
    try {
        let [{data: season}, {data: show}] = await Promise.all([
            tmdb.getTvSeasonDetails(req.body.tmdbShowId, req.body.season),
            tmdb.getDetails("tv", req.body.tmdbShowId)
        ]);
        let log = req.body;
        const seasonLog = new Log( {
            logType: LogTypes.TV_SEASON,
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
            tags: log.tags,
            userId: req.user._id,
            season: {
                name: req.body.season > 0 ? `Season ${req.body.season}` : `Specials`,
                season: req.body.season,
                showName: show.name,
                tmdbShowId: req.body.tmdbShowId,
                poster: season.poster_path,
                airDate: season.air_date,
            }
        });
        await seasonLog.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.logShow = async (req, res) => {
    try {
        let {data: show} = await tmdb.getDetails("tv", req.body.tmdbShowId);
        let log = req.body;
        const showLog = new Log( {
            logType: LogTypes.TV_SHOW,
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
            tags: log.tags,
            userId: req.user._id,
            tvShow: {
                name: show.name,
                tmdbShowId: req.body.tmdbShowId,
                poster: show.poster_path,
                startDate: show.first_air_date,
                endDate: show.last_air_date,
                status: show.status,
                seasons: show.number_of_seasons,
                episodes: show.number_of_episodes,
            }
        });
        await showLog.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
} 

exports.logMovie = async (req, res) => {
    try {
        let {data: movie} = await tmdb.getDetails("movie", req.body.tmdbMovieId);
        let log = req.body;
        const movieLog = new Log( {
            logType: LogTypes.MOVIE,
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
            tags: log.tags,
            userId: req.user._id,
            movie: {
                name: movie.title,
                tmdbMovieId: req.body.tmdbMovieId,
                poster: movie.poster_path,
                releaseDate: movie.release_date,
                runtime: movie.runtime,
            }
        });
        await movieLog.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
