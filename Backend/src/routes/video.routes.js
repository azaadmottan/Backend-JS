import express from 'express';
import { upload }  from "../middlewares/multer.middleware.js";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { publishVideo } from '../controllers/video.controllers.js';

const router = express.Router();

// route for publishing video

router.route("/").post(verifyJWT, upload.fields(
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

export default router;