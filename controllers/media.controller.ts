const axios = require('axios')


exports.searchMulti = async (req, res) => {
    try {
        const { query } = req.query
        const { data } = await axios.get(`${process.env.TMDB_API_HOST}/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`)
        return res.status(200).send(data.results)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error searching for media"
        });
    }
}