import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";

// create tweet

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// toggle tweet like

const toggleTweetLike = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const isLikedTweet = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (isLikedTweet) {

        await Like.findByIdAndDelete(isLikedTweet?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false, tweet: tweetId, likedBy: req.user?._id }, "Remove tweet like" ));
    }

    await Like.create({ 
        tweet: tweetId, 
        likedBy: req.user?._id 
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true, tweet: tweetId, likedBy: req.user?._id }, "Add tweet like"));
});

// update tweet

const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to edit this tweet");
    }

    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            }
        },
        { new: true }
    );

    if (!updateTweet) {
        throw new ApiError(500, "Failed to update tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateTweet, "Tweet updated successfully"));
});

// get user tweets

const getUserTweets = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const tweets = await Tweet.find({ owner: userId.toString()});

    if (!tweets) {
        throw new ApiError(404, "No tweets found");
    }

    const tweetsAggregate = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            userName: 1,
                            fullName: 1,
                            "avatar.url": 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeDetails",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likeDetails",
                },
                ownerDetails: {
                    $first: "$ownerDetails",
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likeDetails.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                ownerDetails: 1,
                likesCount: 1,
                createdAt: 1,
                isLiked: 1
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, tweetsAggregate, "Tweets fetched successfully"));
});

// delete tweet

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString()!== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(200, { tweet: tweetId }, "Tweet deleted successfully"));
});


export {
    createTweet,
    toggleTweetLike,
    updateTweet,
    getUserTweets,
    deleteTweet,
}