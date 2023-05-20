const List = require('../models/list.model');
const ListItem = require('../models/listItem.model');
const User = require('../models/user.model');
const {ListTypes, ListItemTypes, CategoryLabels} = require('../utils/types');
const tmdb = require('../utils/tmdb');
const mongoose = require('mongoose');

async function createNewListItem(listId, listItem, rank, userId) {
    const newListItem = new ListItem({
        listId: listId,
        userId: userId,
        type: listItem.type,
        rank: rank,
    });
    switch (listItem.type) {
        case ListItemTypes.MOVIE:
            let {data: movie} = await tmdb.getDetails('movie', listItem.movie.tmdbMovieId);
            newListItem.movie = {
                name: movie.title,
                releaseDate: movie.release_date,
                poster: movie.poster_path,
                tmdbMovieId: movie.id
            }
            break;
        case ListItemTypes.TV_SHOW:
            let {data: show} = await tmdb.getDetails('tv', listItem.tvShow.tmdbShowId);
            newListItem.tvShow = {
                name: show.name,
                startDate: show.first_air_date,
                endDate: show.last_air_date,
                poster: show.poster_path,
                tmdbShowId: show.id,
                status: show.status
            }
            break;
        case ListItemTypes.TV_SEASON:
            let [{data: season}, {data: show1}] = await Promise.all([
                tmdb.getTvSeasonDetails(listItem.tvSeason.tmdbShowId, listItem.tvSeason),
                tmdb.getDetails("tv", listItem.tvSeason.tmdbShowId)
            ]);
            newListItem.tvSeason = {
                name: listItem.tvSeason.season > 0 ? `Season ${listItem.tvSeason.season}` : "Specials",
                season: listItem.tvSeason.season,
                showName: show1.name,
                tmdbShowId: listItem.tvSeason.tmdbShowId,
                poster: season.poster_path,
                airDate: season.air_date,
            }
            break;
        case ListItemTypes.TV_EPISODE:
            let [{data: episode}, {data: show2}] = await Promise.all([
                tmdb.getTvEpisodeDetails(listItem.tvEpisode.tmdbShowId, listItem.tvEpisode.season, listItem.tvEpisode.episode),
                tmdb.getDetails("tv", listItem.tvEpisode.tmdbShowId)
            ]);
            newListItem.tvEpisode = {
                name: episode.name,
                season: listItem.tvEpisode.season,
                episode: listItem.tvEpisode.episode,
                showName: show2.name,
                tmdbShowId: listItem.tvEpisode.tmdbShowId,
                tmdbEpisodeId: episode.id,
                poster: episode.still_path,
                airDate: episode.air_date,
            }
            break;
        case ListItemTypes.CATEGORY:
            newListItem.category = {
                listId: listItem.category.listId,
            }
            break;
        case ListItemTypes.PERSON:
            let {data: person} = await tmdb.getDetails('person', listItem.person.tmdbPersonId);
            newListItem.person = {
                name: person.name,
                poster: person.profile_path,
                tmdbPersonId: person.id
            }
            break;
        default:
            break;
    }
    let result = await newListItem.save();
    return result;
}




exports.createCustomList = async (req, res) => {
    try {
        let list = req.body;
        const newList = new List({
            name: list.name,
            listType: ListTypes.CUSTOM,
            description: list.description,
            ranked: list.ranked,
            tags: list.tags,
            userId: req.user._id,
            isPrivate: list.isPrivate,
        });
        let createdNewList = await newList.save();
        await Promise.all(list.listItems.map(async (listItem, index) => {
            return await createNewListItem(createdNewList._id, listItem, index + 1, req.user._id);
        }));
        return res.status(201).send(createdNewList);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.updateCustomList = async (req, res) => {
    try {
        let list = req.body;
        let listId = req.params.listId;
        let listToUpdate = await List.findById(listId);
        if (!listToUpdate) {
            res.sendStatus(404);
            return;
        }
        if (listToUpdate.userId.toString() !== req.user._id.toString()) {
            res.sendStatus(403);
            return;
        }
        if (listToUpdate.listType !== ListTypes.CUSTOM || listToUpdate.listType !== ListTypes.OSCARS || listToUpdate.listType !== ListTypes.FTBBW) {
            res.status(400).send({message: "Cannot update this list type."});
            return;
        }
        listToUpdate.name = list.name;
        listToUpdate.description = list.description;
        listToUpdate.ranked = list.ranked;
        listToUpdate.tags = list.tags;
        listToUpdate.isPrivate = list.isPrivate;
        let updatedList = await listToUpdate.save();

        await ListItem.updateMany({listId: listId}, {deleted: true});
        await Promise.all(list.listItems.map(async (listItem, index) => {
            if (listItem._id) {
                let listItemToUpdate = await ListItem.findById(listItem._id);
                if (listItemToUpdate) {
                    listItemToUpdate.deleted = false;
                    listItemToUpdate.rank = index + 1;
                    return await listItemToUpdate.save();
                }
            }
            return await createNewListItem(listId, listItem, index + 1, req.user._id);
        }));
        ListItem.deleteMany({listId: listId, deleted: true});
        return res.status(200).send(updatedList);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.getListHelperFunction = async (listId, userId) => {
    try {
        let list = await List.findById(listId).populate( {
            path: 'userId',
            select: 'displayName profilePicture'
        });
        if (!list) {
            return { success: false, message: "List not found"};
        }
        if (list.isPrivate && list.userId._id.toString() !== userId.toString()) {
            return { success: false, message: "Cannot access private list that is not yours"};
        }
        let listItems = await ListItem.find({listId: listId, deleted: false}).sort({rank: 1});
        return { success: true, list: list, listItems: listItems};
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal server error"};
    }
}

exports.getList = async (req, res) => {
    try {
        let listId = req.params.listId;
        let userId = req.user ? req.user._id : null;
        let result = await this.getListHelperFunction(listId, userId);
        if (!result.success) {
            res.status(404).send({
                message: result.message
            })
            return;
        }
        res.status(200).send({
            list: result.list,
            listItems: result.listItems
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.deleteList = async (req, res) => {
    try {
        let listId = req.params.listId;
        let list = await List.findById(listId);
        if (!list) {
            res.status(404).send({
                message: "List not found"
            })
            return;
        }
        if (list.userId.toString() !== req.user._id.toString()) {
            res.status(403).send({
                message: "Cannot delete list that is not yours"
            })
            return;
        }
        if (list.listType === ListTypes.WATCHLIST) {
            res.status(403).send({
                message: "Cannot delete watchlist"
            })
            return;
        }
        await List.deleteOne({_id: listId});
        await ListItem.deleteMany({listId: listId});
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.getUserLists = async (req, res) => {
    try {
        let userId = req.user._id;
        let lists = await List.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    listType: {
                        $in: [ListTypes.CUSTOM, ListTypes.OSCARS, ListTypes.FTBBW]
                    }
                }
            },
            {
                $lookup: {
                    from: "ListItems",
                    localField: "_id",
                    foreignField: "listId",
                    as: "allListItems",
                    pipeline: [
                        {
                            $sort: {
                                rank: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    ranked: 1,
                    tags: 1,
                    userId: 1,
                    isPrivate: 1,
                    listCount: {
                        $size: "$allListItems"
                    },
                    listItems: {
                        // limit to first 5
                        $slice: ["$allListItems", 4]
                    },
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]);

        res.status(200).send(lists);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.updateFavoriteList = async (req, res) => {
    let listType = req.params.listType;
    let listItems = req.body;
    let userId = req.user._id;
    let list = await List.findOne({userId: userId, listType: listType});
    // if list doesn't exist, create it
    if (!list && listItems.length > 0) {
        let formattedName = listType.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        let newList = new List({
            name: formattedName,
            listType: listType,
            description: "",
            ranked: false,
            tags: [],
            userId: userId,
            isPrivate: false,
            maxSize: 4,
        });
        list = await newList.save();
        await User.updateOne({_id: userId}, {$push: {favoriteLists: list._id}});
    }
    // delete all list items
    await ListItem.deleteMany({listId: list._id});
    // create new list items
    await Promise.all(listItems.map(async (listItem, index) => {
        return await createNewListItem(list._id, listItem, index + 1, userId);
    }));
    // if list is empty, delete it
    if (listItems.length === 0) {
        await User.updateOne({_id: userId}, {$pull: {favoriteLists: list._id}});
        await List.deleteOne({_id: list._id});
    }
    return res.sendStatus(200);
};

    


