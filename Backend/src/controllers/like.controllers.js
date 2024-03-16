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



export {
    toggleLikeVideo,
}
