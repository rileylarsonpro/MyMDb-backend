require('dotenv').config();
const axios = require('axios');

exports.searchMulti = (itemType, query) => {
    return axios.get(`${process.env.TMDB_API_HOST}/search/${itemType}?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`)
}

exports.getDetails = (mediaType, id, append = "") => {
    return axios.get(`${process.env.TMDB_API_HOST}/${mediaType}/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US${append}`)
}

exports.getTvEpisodeDetails = (tvId, seasonNumber, episodeNumber, append = "") => {
    return axios.get(`${process.env.TMDB_API_HOST}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US${append}`)
}

exports.getTvSeasonDetails = (tvId, seasonNumber, append = "") => {
    return axios.get(`${process.env.TMDB_API_HOST}/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=en-US${append}`)
}