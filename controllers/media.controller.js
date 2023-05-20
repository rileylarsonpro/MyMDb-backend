const tmdb = require('../utils/tmdb')


exports.searchMulti = async (req, res) => {
    try {
        const { query } = req.query
        const { itemType } = req.params
        if (!query) return res.status(400).send({
            message: "Missing query"
        })
        if (!itemType) return res.status(400).send({
            message: "Missing itemType"
        })
        if (itemType === "movie" || itemType === "tv" || itemType === "person" || itemType === "multi") {
            const { data } = await tmdb.searchMulti(itemType, query)
            return res.status(200).send(data.results)
        }
        return res.status(400).send({
            message: "Invalid itemType"
        })

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
        if (mediaType === "tv") append = "&append_to_response=content_ratings";
        let { data } = await tmdb.getDetails(mediaType, id, append)
        // format content ratings for us only 
        if (mediaType === "tv") {
            data.content_ratings.results = data.content_ratings.results.filter(rating => rating.iso_3166_1 === "US")
            if (data.content_ratings.results.length === 0) {
                data.content_rating = ""
            } else {
                data.content_rating = data.content_ratings.results[0].rating || ""
            }
            // for groups of 20 or less seasons make an api call with the season number appended to the end of the url
            if (data.seasons.length > 20) {
                let axiosCalls = []
                for (let i = 0; i < data.seasons.length; i += 20) {
                    let append = "&append_to_response=season/" + data.seasons[i].season_number
                    for (let j = i + 1; (j < i + 20 && j < data.seasons.length); j++) {
                        append += ",season/" + data.seasons[j].season_number
                    }
                    axiosCalls.push(tmdb.getDetails(mediaType, id, append));
                }
                const requestGroup = await axios.all(axiosCalls)
                requestGroup.forEach(response => {
                    data = { ...data, ...response.data }
                })
            }
            else if (data.seasons.length > 0) {
                let append = "&append_to_response=season/" + data.seasons[0].season_number
                for (let i = 1; i < data.seasons.length; i++) {
                    append += ",season/" + data.seasons[i].season_number
                }
                const { data: seasonData } = await tmdb.getDetails(mediaType, id, append)
                data = { ...data, ...seasonData }
            }

            
        }
        if (mediaType === "movie") {
            data.release_dates.results = data.release_dates.results.filter(rating => rating.iso_3166_1 === "US")
            if (data.release_dates.results.length === 0) {
                data.content_rating = ""
            } else {
                if (data.release_dates.results[0].release_dates.length === 0) data.content_rating = ""
                else {
                    let rating = data.release_dates.results[0].release_dates.find(rating => rating.certification !== "")
                    if (!rating) data.content_rating = ""
                    else data.content_rating = rating.certification
                }
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