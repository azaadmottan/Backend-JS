import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary }  from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";

// get video & tumbnail file, upload to cloudinary and create video & thumbnail.

const publishVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    if ([ title, description ].some( (field) => (!field) || (field?.trim() === "") )) {
        throw new ApiError(400, "All fields are required");
    }

    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailFileLocalPath = req.files?.thumbnailFile[0].path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "videoFileLocalPath is required")
    }

    if (!thumbnailFileLocalPath) {
        throw new ApiError(400, "thumbnailFileLocalPath is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailFileLocalPath);

    if (!videoFile) {
        throw new ApiError(404, "Video file not found");
    }

    if (!thumbnailFile) {
        throw new ApiError(404, "Thumbnail file not found");
    }

    const video = await Video.create({
        title,
        description,
        duration: videoFile.duration,
        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id 
        },
        thumbnail: {
            url: thumbnailFile.url,
            public_id: thumbnailFile.public_id
        }, 
        owner: req.user?._id,
        isPublished: false        
    });

    const videoUploaded = await Video.findById(video._id);

    if (!videoUploaded) {
        throw new ApiError(500, "videoUpload failed please try again !");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

// get all videos based on query, sort & pagination

const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pipeline = [];

    if (query) {
        pipeline.push({
            $search: {
                index: "search-index",
                text: {
                    query: query,
                    path: ["title", "description"]
                }
            }
        })
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            }
        });
    }

    // fetch videos only that are set isPublished as true

    pipeline.push({
        $match: {
            isPublished: true,
        }
    });

    // sortBy can be views, createdAt & duration
    // sortType can be asc (1) & desc (-1)

    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    }
    else {
        pipeline.push({
            $sort: {
                createdAt: -1
            }
        });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1
                        }
                    }
                ]
            }, 
        },
        {
            $unwind: "$ownerDetails",
        }
    );

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export {
    publishVideo,
    getAllVideos
}