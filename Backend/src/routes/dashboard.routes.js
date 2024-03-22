import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getChannelStats, 
    getChannelVideos
} from "../controllers/dashboard.controllers.js";

const router = Router();

router.use(verifyJWT);

// route for dashboard

router.route("/getChannelStats").get(getChannelStats);
router.route("/getChannelVideos").get(getChannelVideos);

export default router;