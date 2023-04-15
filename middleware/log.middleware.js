const { checkSchema, validationResult } = require('express-validator');
const Tag = require('../models/tag.model');
const sanitizeHtml = require('sanitize-html');

//standardizing validations to run in parallel
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            errors: errors.array()
        });
    }
};

//generic log validation schema
const logValidationSchema = {
    dateWatched: {
        custom: {
            options: (value) => {
                // is either date or null
                if (value === null) {
                    return true;
                }
                let date = new Date(value);
                console.log(date);
                console.log(date.toString());
                console.log(isNaN(date.toString()));
                if (date.toString() === 'Invalid Date') {
                    throw new Error('Date watched must be a date or null');
                }
                // date cant be in the future
                if (date > new Date()) {
                    throw new Error('Date watched must be in the past');
                }
                // date cant be before 1900
                if (date < new Date(1900, 0, 1)) {
                    throw new Error('Date watched must be after 1900');
                }
                return true;
            }
        }
    },
    liked: {
        isBoolean: true
    },
    rating: {
        notEmpty: {
            errorMessage: "Rating must be provided"
        },
        isInt: {
            options: {
                min: 0,
                max: 10
            }
        }
    },
    reviewText: {
        isString: true,
        custom: {
            options: (value) => {
                if (value.length > 10000) {
                    throw new Error(`Review must be less than 10000 characters`);
                }
                return true;
            }
        }
    },
    noteText: {
        isString: true,
        custom: {
            options: (value) => {
                if (value.length > 10000) {
                    throw new Error(`Note must be less than 10000 characters`);
                }
                return true;
            }
        }
    },
    isRewatch: {
        isBoolean: true
    },
    isPrivate: {
        isBoolean: true
    },
    containsSpoilers: {
        isBoolean: true
    },
    tags: {
        isArray: true,
        custom: {
            options: value => {
                if (value.length > 50) {
                    throw new Error('Cannot have more than 50 tags');
                }
                return true;
            }
        }
    },
};

tvEpisodeLogValidationSchema = {
    ...logValidationSchema,
    tvShowId: {
        isInt: true
    },
    tvSeason: {
        isInt: true
    },
    tvEpisode: {
        isInt: true
    }
};

exports.validateLogTvEpisode = validate(checkSchema(tvEpisodeLogValidationSchema));

tvSeasonLogValidationSchema = {
    ...logValidationSchema,
    tvShowId: {
        isInt: true
    },
    tvSeason: {
        isInt: true
    }
};

exports.validateLogTvSeason = validate(checkSchema(tvSeasonLogValidationSchema));

tvShowLogValidationSchema = {
    ...logValidationSchema,
    tvShowId: {
        isInt: true
    }
};

exports.validateLogTvShow = validate(checkSchema(tvShowLogValidationSchema));

movieLogValidationSchema = {
    ...logValidationSchema,
    movieId: {
        isInt: true
    }
};

exports.validateLogMovie = validate(checkSchema(movieLogValidationSchema));


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

const sanitizeHtmlOptions = {
    allowedTags: [ 'p', 'br', 'strong', 'em', 'strong', 'u', 'ol', 'ul', 'li', 'a' ],
    allowedAttributes: {
      'a': [ 'href', 'rel' ]
    },
};


exports.sanitizeLogHTML = (req, res, next) => {
    // if reviewText or noteText are exclusively a combination of <p> or </p> or <br> tags set them to empty strings regex
    if (req.body.reviewText && req.body.reviewText.match(/^(<p>|<\/p>|<br>|\s)*$/)) {
        req.body.reviewText = '';
    }
    if (req.body.noteText && req.body.noteText.match(/^(<p>|<\/p>|<br>|\s)*$/)) {
        req.body.noteText = '';
    }
    req.body.reviewText = sanitizeHtml(req.body.reviewText, sanitizeHtmlOptions);
    req.body.noteText = sanitizeHtml(req.body.noteText, sanitizeHtmlOptions);
    next();
}

