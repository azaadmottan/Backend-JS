import mongoose, { connect, isValidObjectId } from "mongoose";
import { ApiError }  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment }  from "../models/comment.model.js";
import { Like } from "../models/like.model.js";


// add comment on video

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { content }  = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id,
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// get all comments of the video

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);;

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const commentsAggregate = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: {$in: [ req.user?._id, "$likes.likedBy" ]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                isLiked: 1,
                likesCount: 1,
                owner: {
                    userName: 1,
                    fullName: 1,
                    avatar: 1
                },
                createdAt: 1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, commentsAggregate, "Comments fetched successfully"));
});

// toggle comment like

const toggleCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const isLikedComment = await Like.findOne({ 
        comment: commentId,
        likedBy: req.user?._id
    });

    if (isLikedComment) {

        await Like.findByIdAndDelete(isLikedComment?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false, comment: commentId, likedBy: req.user?._id }, "Remove comment like"));
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true, comment: commentId, likedBy: req.user?._id }, "Add comment like"));
});

// update comment

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    if (!content) {
        throw new ApiError(400, "Invalid content");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment?.owner?.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to edit comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment?._id,
        {
            $set: {
                content,
            } 
        },
        { 
            new: true
        }
    );

    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// delete comment

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You don't have permission to delete comment");
    }

    await Comment.findByIdAndDelete(comment?._id);
    
    await Like.deleteMany({
        comment: comment?._id,
        likedBy: req.user
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {"Comment Id " : comment?._id}, "Comment deleted successfully"));
});

export {
    addComment,
    updateComment,
    getVideoComments,
    toggleCommentLike,
    deleteComment,
}