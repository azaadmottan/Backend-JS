import express from "express";

const app = express();

// middlewares i.e app.use();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

export { app };
// export default app;


// Two different way to 'export' the "app".

// 1. by using 'default app' keyword.
// 2. by using '{ app }'.