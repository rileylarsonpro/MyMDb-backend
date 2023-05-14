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
                                if (!item.tmdbMovieId) {
                                    throw new Error('Movie id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SHOW:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SEASON:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.season) {
                                    throw new Error('Season number must be provided');
                                }
                                break;
                            case ListItemTypes.TV_EPISODE:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.season) {
                                    throw new Error('Season number must be provided');
                                }
                                if (!item.episode) {
                                    throw new Error('Episode number must be provided');
                                }
                                break;
                            case ListItemTypes.CATEGORY:
                                if (!item.listId) {
                                    let list = await List.findOne({ _id: item.listId, isCategory: true });
                                    if (!list) {
                                        throw new Error('valid category must be provided');
                                    }
                                }
                                break;
                            case ListItemTypes.PERSON:
                                if (!item.tmdbPersonId) {
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

const updateListValidationSchema = {
    name: {
        optional: true,
        isString: true,
        isLength: {
            options: {
                min: 1,
                max: 250
            }
        }
    },
    description: {
        optional: true,
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
        optional: true,
        isBoolean: true
    },
    isPrivate: {
        optional: true,
        isBoolean: true
    },
    tags: {
        optional: true,
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
        optional: true,
        isArray: true,
        custom: {
            options: async (value) => {
                if (value.length > 1000) {
                    throw new Error('Cannot add more than 1000 items to a list at once');
                }
                let promises = value.map(item => {
                    return new Promise(async (resolve, reject) => {
                        if (item._id) {
                            let listItem = await ListItems.findOne({ _id: item._id });
                            if (!listItem) {
                                throw new Error('List item not found');
                            }
                            resolve();
                        }
                        switch (item.type) {
                            case ListItemTypes.MOVIE:
                                if (!item.tmdbMovieId) {
                                    throw new Error('Movie id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SHOW:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                break;
                            case ListItemTypes.TV_SEASON:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.season) {
                                    throw new Error('Season number must be provided');
                                }
                                break;
                            case ListItemTypes.TV_EPISODE:
                                if (!item.tmdbShowId) {
                                    throw new Error('TV Show id must be provided');
                                }
                                if (!item.season) {
                                    throw new Error('Season number must be provided');
                                }
                                if (!item.episode) {
                                    throw new Error('Episode number must be provided');
                                }
                                break;
                            case ListItemTypes.CATEGORY:
                                if (!item.listId) {
                                    let list = await List.findOne({ _id: item.listId, isCategory: true });
                                    if (!list) {
                                        throw new Error('valid category must be provided');
                                    }
                                }
                                break;
                            case ListItemTypes.PERSON:
                                if (!item.personId) {
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

exports.validateUpdateList = validate(checkSchema(updateListValidationSchema));

exports.sanitizeDescriptionHTML = (req, res, next) => {
    req.body.description = sanitizeHTML(req.body.description);
    next();
} 







