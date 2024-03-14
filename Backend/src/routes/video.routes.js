import express from 'express';
import { upload }  from "../middlewares/multer.middleware.js";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { getAllVideos, publishVideo, updateVideo } from '../controllers/video.controllers.js';

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
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

export default router;