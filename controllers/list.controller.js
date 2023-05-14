const List = require('../models/list.model');
const ListItem = require('../models/listItem.model');
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

exports.getList = async (req, res) => {
    try {
        let listId = req.params.listId;
        let list = await List.findById(listId).populate( {
            path: 'userId',
            select: 'displayName profilePicture'
        });
        if (!list) {
            res.status(404).send({
                message: "List not found"
            })
            return;
        }
        if (list.isPrivate && list.userId._id.toString() !== req.user._id.toString()) {
            res.status(403).send({
                message: "Cannot access private list that is not yours"
            })
            return;
        }
        let listItems = await ListItem.find({listId: listId, deleted: false}).sort({rank: 1});
        res.status(200).send({
            list: list,
            listItems: listItems
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.deleteCustomList = async (req, res) => {
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
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "ListItems",
                    localField: "_id",
                    foreignField: "listId",
                    as: "allListItems"
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

