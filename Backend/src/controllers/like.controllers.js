import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import  { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Like } from "../models/like.model.js";


// toggle like video

const toggleLikeVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const isLikedAlready = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (isLikedAlready) {

        await Like.findOneAndDelete(isLikedAlready?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Remove like"));
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Add like"));
});

// get user liked videos 

const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideoAggregate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                        }
                    }, 
                    {
                        $unwind: "$ownerDetails",
                    }
                ]
            },
        }, 
        {
            $unwind: "$likedVideo",
        },
        {
            $sort: {
                createdAt: -1
            }
        }, 
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    isPublished: 1,
                    owner: 1,
                    ownerDetails: {
                        userName: 1,
                        fullName: 1,
                        "avatar": 1,
                    }
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideoAggregate, "Liked videos fetched successfully"));
});


export {
    toggleLikeVideo,
    getLikedVideos,
}
