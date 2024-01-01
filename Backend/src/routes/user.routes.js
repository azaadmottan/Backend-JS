import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);


// secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);     // path is used for update specific user-data.

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);     // path is used for update specific user-data.

router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:userName").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getUserWatchHistory);


export default router;