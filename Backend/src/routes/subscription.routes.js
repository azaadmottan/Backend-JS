import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggleSubscription/:channelId").post(toggleSubscription);
router.route("/getUserChannelSubscriber/:channelId").get(getUserChannelSubscribers);
router.route("/getSubscribedChannels/:subscriberId").get(getSubscribedChannels);

export default router;