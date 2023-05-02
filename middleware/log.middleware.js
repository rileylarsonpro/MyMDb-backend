const { checkSchema, validationResult } = require('express-validator');
const { sanitizeHTML } = require('../utils/functions');

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

episodeLogValidationSchema = {
    ...logValidationSchema,
    tmdbShowId: {
        isInt: true
    },
    season: {
        isInt: true
    },
    episode: {
        isInt: true
    }
};

exports.validateLogTvEpisode = validate(checkSchema(episodeLogValidationSchema));

seasonLogValidationSchema = {
    ...logValidationSchema,
    tmdbShowId: {
        isInt: true
    },
    season: {
        isInt: true
    }
};

exports.validateLogTvSeason = validate(checkSchema(seasonLogValidationSchema));

tvShowLogValidationSchema = {
    ...logValidationSchema,
    tmdbShowId: {
        isInt: true
    }
};

exports.validateLogTvShow = validate(checkSchema(tvShowLogValidationSchema));

movieLogValidationSchema = {
    ...logValidationSchema,
    tmdbMovieId: {
        isInt: true
    }
};

exports.validateLogMovie = validate(checkSchema(movieLogValidationSchema));






exports.sanitizeLogHTML = (req, res, next) => {
    req.body.reviewText = sanitizeHTML(req.body.reviewText);
    req.body.noteText = sanitizeHTML(req.body.noteText);
    next();
}

