const Tag = require('../models/tag.model');

async function getTagId(tag, userId) {
    let formattedTag = tag.toLowerCase().trim();
    let existingTag = await Tag.findOne({name: formattedTag});
    if (existingTag) {
        return existingTag._id;
    }
    else {
        let newTag = new Tag({name: formattedTag, userId: userId});
        await newTag.save();
        return newTag._id;
    }
}

exports.handleTags = async (req, res, next) => {
    let tagPromises = [];
    for (let tag of req.body.tags) {
        tagPromises.push(getTagId(tag, req.user._id));
    }
    req.body.tags = await Promise.all(tagPromises);
    next();
}