const Tag = require('../models/tag.model');

exports.getUserTags = async (req, res, next) => {
    try {
        let tags = await Tag.find({userId: req.user._id});
        res.status(200).send(tags);
    }
    catch (err) {
        next(err);
    }
}