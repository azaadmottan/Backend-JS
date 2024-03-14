import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary }  from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js";

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


export {
    publishVideo,
}