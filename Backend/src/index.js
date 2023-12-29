import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({

    path: "./env"
});


connectDB();            // connect database










/*

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

const app = express();

( async () => {

    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        // connect frontend application to the database.

        app.on("error", (error) => {

            console.log("\nError: Failed to load application !!\nERROR: ", error);
            throw error;
        });

        app.listen((process.env.PORT), () => {

            console.log(`\nApplication is serve at PORT: http://localhost:${process.env.PORT}`);

        });
    } catch (error) {

        console.error("Error: Database (mongoDB) connection FAILED !! \nERROR: ", error);
        throw error;
    }
})();     

*/

// It is preferable to use 'async' and 'await' (try and catch) during database connectivity. 

// Easy way to remember database connection:

//      DATABASE IS PRESENT IN ANOTHER CONTINENT.

// That's why we use 'async' and 'await', during database connectivity.

// Two different ways to connect to the database.

// By using Immediate Invoked Function Expression (IIFE).

// By including 'external file' of the database connection i.e db/index.js.