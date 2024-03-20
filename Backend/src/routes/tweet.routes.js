import express from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createTweet, 
    deleteTweet, 
    getUserTweets, 
    toggleTweetLike, 
    updateTweet 
} from '../controllers/tweet.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.use(verifyJWT, upload.none());

// routes for tweet

router.route("/").post(createTweet);
router.route("/toggleLike/t/:tweetId").post(toggleTweetLike);
router.route("/getTweets/:userId").get(getUserTweets);
router.route("/updateTweet/:tweetId").post(updateTweet);
router.route("/deleteTweet/:tweetId").delete(deleteTweet);


export default router;