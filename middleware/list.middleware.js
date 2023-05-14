const { checkSchema, validationResult } = require('express-validator');
const { ListItemTypes } = require('../utils/types');
const List = require('../models/list.model');
const ListItems = require('../models/listItem.model');
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

const createListValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name must be provided"
        },
        isString: true,
        isLength: {
            options: {
                min: 1,
                max: 250
            }
        }
    },
    description: {
        isString: true,
        custom: {
            options: (value) => {
                if (value.length > 10000) {
                    throw new Error(`Description must be less than 10000 characters`);
                }
                return true;
            }
        }
    },
    ranked: {
        isBoolean: true
    },
    isPrivate: {
        optional: true,
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
    listItems: {
        isArray: true,
        custom: {
            options: async (value) => {
                if (value.length > 1000) {
                    throw new Error('Cannot add more than 1000 items to a list at once');
                }
                let promises = value.map(item => {
                    return new Promise(async (resolve, reject) => {
                        switch (item.type) {
                            case ListItemTypes.MOVIE:
                                if (!item.movie.tmdbMovieId) {
                                    throw new Error('Movie id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SHOW:
                                if (!item.tvShow.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SEASON:
                                if (!item.tvSeason.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.tvSeason.season) {
                                    throw new Error('Season number must be provided');
                                }
                                break;
                            case ListItemTypes.TV_EPISODE:
                                if (!item.tvEpisode.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.tvEpisode.season) {
                                    throw new Error('Season number must be provided');
                                }
                                if (!item.tvEpisode.episode) {
                                    throw new Error('Episode number must be provided');
                                }
                                break;
                            case ListItemTypes.CATEGORY:
                                if (!item.category.listId) {
                                    let list = await List.findOne({ _id: item.listId, isCategory: true });
                                    if (!list) {
                                        throw new Error('valid category must be provided');
                                    }
                                }
                                break;
                            case ListItemTypes.PERSON:
                                if (!item.person.tmdbPersonId) {
                                    throw new Error('Person id must be provided');
                                }
                                break;
                            default:
                                throw new Error('Invalid list item type');
                        }
                        resolve();
                    });
                });
                await Promise.all(promises);
                return true;
            }
        }
    }
}

exports.validateCreateList = validate(checkSchema(createListValidationSchema));


exports.validateUpdateList = validate(checkSchema(createListValidationSchema));

exports.sanitizeDescriptionHTML = (req, res, next) => {
    req.body.description = sanitizeHTML(req.body.description);
    next();
} 







