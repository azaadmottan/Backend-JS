import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

// create a new playlist

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and Description are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    });

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// update playlist

const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }
    
    if (!name || !description) {
        throw new ApiError(400, "Name and Description are required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to update the playlist");
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    );

    if (!updatePlaylist) {
        throw new ApiError(500, "Failed to update playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatePlaylist, "Playlist updated successfully"));
});

// add video to playlist

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if ((playlist?.owner.toString() && video?.owner.toString()) !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to add video to this playlist");
    }

    const addVideo = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $addToSet: {
                video: video?._id
            }
        },
        { new: true }
    );

    if (!addVideo) {
        throw new ApiError(500, "Failed to add video to playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, addVideo, "Video added to playlist successfully"));
});

// remove video from playlist

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if ((playlist?.owner.toString() && video?.owner.toString()) !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to remove video from this playlist");
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $pull: {
                video: video?._id
            }
        },
        { new: true }
    );

    if (!removeVideo) {
        throw new ApiError(500, "Failed to remove video from playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, removeVideo, "Video removed from playlist successfully"))
});

// get playlist by id

const getPlaylistById = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const getPlaylist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            },
        },
        {
            $match: {
                "video.isPublished": true
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            },
        },
        {

            $addFields: {
                owner: {
                    $first: "$owner"
                },
                totalVideos: {
                    $size: "$video"
                },
                totalViews: {
                    $sum: "$video.views"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                createdAt: 1,
                updatedAt: 1,
                video: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    // owner: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
                owner: {
                    userName: 1,
                    fullName: 1,
                    "avatar": 1
                }
            }
        }
    ]);

    if (!getPlaylist) {
        throw new ApiError(500, "Failed to fetch playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getPlaylist, "Playlist fetched successfully"));
});

// get user playlists

const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const getPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$video"
                },
                totalViews: {
                    $sum: "$video.views"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, { "user playlists": getPlaylists, "total playlists": getPlaylists.length }, "User playlists fetched successfully"));
});

// delete playlist

const deletePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to delete this playlist");
    }

    const deletePlaylist = await Playlist.findByIdAndDelete(playlist?._id);

    if (!deletePlaylist) {
        throw new ApiError(500, "Failed to delete playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletePlaylist, "Playlist deleted successfully"));
});


export {
    createPlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    getUserPlaylists,
    deletePlaylist
}
