import express from 'express';
import { upload }  from "../middlewares/multer.middleware.js";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { 
    deleteVideo, 
    getAllVideos, 
    publishVideo, 
    toggleVideoPublishStatus, 
    updateVideo 
} from '../controllers/video.controllers.js';

const router = express.Router();

// route for publishing video

router.route("/").get(getAllVideos).post(verifyJWT, upload.fields(
    [ 
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnailFile",
            maxCount: 1
        }
    ]
), publishVideo);

// route for update video details

router.route("/v/:videoId")
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .delete(verifyJWT, deleteVideo);

// toggle publish status of the video

router.route("/toggle/publish/:videoId")
    .patch(verifyJWT, toggleVideoPublishStatus);
    
export default router;