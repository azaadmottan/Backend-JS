import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js";
import { 
    addVideoToPlaylist,
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists, 
    removeVideoFromPlaylist, 
    updatePlaylist 
} from "../controllers/playlist.controllers.js";


const router = Router();

router.use(verifyJWT, upload.none());

// routes for playlist

router.route("/createPlaylist").post(createPlaylist);
router.route("/updatePlaylist/:playlistId").post(updatePlaylist)
router.route("/addVideoToPlaylist/:playlistId/:videoId").post(addVideoToPlaylist);
router.route("/removeVideoFromPlaylist/:playlistId/:videoId").post(removeVideoFromPlaylist);
router.route("/getPlaylistById/:playlistId").get(getPlaylistById);
router.route("/getUserPlaylists/:userId").get(getUserPlaylists);
router.route("/deletePlaylist/:playlistId").delete(deletePlaylist);

export default router;