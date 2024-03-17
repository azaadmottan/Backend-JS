import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// middlewares i.e app.use();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.use(express.static("public"));

app.use(cookieParser());


// import routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);      
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

// the route will become

// http://localhost:8000/api/v1/users/register

export { app };


// export default app;


// Two different way to 'export' the "app".

// 1. by using 'default app' keyword.
// 2. by using '{ app }'.