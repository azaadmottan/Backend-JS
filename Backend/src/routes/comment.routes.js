import express from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addComment,
    deleteComment,
    getVideoComments,
    toggleCommentLike,
    updateComment
} from '../controllers/comment.controllers.js';


const router = express.Router();

router.use(verifyJWT);

// route for add comment to video
router.route("/c/:videoId").post(addComment);
router.route("/c/:videoId").get(getVideoComments);
router.route("/toggleCommentLike/:commentId").post(toggleCommentLike);
router.route("/updateComment/:commentId").post(updateComment);
router.route("/deleteComment/:commentId").delete(deleteComment);



export default router;