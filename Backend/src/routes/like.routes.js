import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    getLikedVideos,
    toggleLikeVideo,
} from '../controllers/like.controllers.js';

const router = express.Router();

router.use(verifyJWT);  // Apply verifyJWT middleware to all routes in this file

// route for like video

router.route("/toggleLike/v/:videoId").post(toggleLikeVideo);
router.route("/getLikedVideos").get(getLikedVideos);

export default router;