const axios = require('axios')


exports.searchMulti = async (req, res) => {
    try {
        const { query } = req.query
        if (!query) return res.status(400).send({
            message: "Missing query"
        })
        const { data } = await axios.get(`${process.env.TMDB_API_HOST}/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`)
        return res.status(200).send(data.results)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error searching for media"
        });
    }
}

exports.getDetails = async (req, res) => {
    try {
        const { mediaType, id } = req.params
        if (!mediaType || !id) return res.status(400).send({
            message: "Missing mediaType or id"
        })
        let append = ""
        if (mediaType === "movie") append = "&append_to_response=release_dates";
        if( mediaType === "tv") append = "&append_to_response=content_ratings";
        const { data } = await axios.get(`${process.env.TMDB_API_HOST}/${mediaType}/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US${append}`)
        // format content ratings for us only 
        if (mediaType === "tv") {
            data.content_ratings.results = data.content_ratings.results.filter(rating => rating.iso_3166_1 === "US")
            if (data.content_ratings.results.length === 0) {
                data.content_rating = ""
            } else {
                data.content_rating = data.content_ratings.results[0].rating || ""
            }
        }
        if (mediaType === "movie") {
            data.release_dates.results = data.release_dates.results.filter(rating => rating.iso_3166_1 === "US")
            if (data.release_dates.results.length === 0) {
                data.content_rating = ""
            } else {
                data.content_rating = data.release_dates.results[0].release_dates.find(rating => rating.certification !== "").certification || ""
            }
        }
        return res.status(200).send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error getting media details"
        });
    }
}