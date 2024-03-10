import express from "express";
import cors from "cors";
import bookRouter from "./routes/book.route.js";

const app = express();

// Middleware for parsing request body

app.use(
    express.json({

        limit: "18kb",}
    )
);

// Middleware for handling CORS-policy

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ['Content-Type']}
    )
);

// Home Route

app.get('/', (req, res) => {

    return  res.status(200).send({

        message: 'Welcome to the Book Store.',
    });
});

// Book Route

app.use('/book', bookRouter);

export default app;