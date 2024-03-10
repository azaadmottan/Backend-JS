import dotenv from "dotenv";
import connectDataBase from "./database/index.js";
import app from "./app.js";

dotenv.config({

    path: "./.env",
});

connectDataBase().
then(() => {

    app.listen(process.env.PORT || 3000, () => {

        console.log(`\n✓ Server is running on port: ${process.env.PORT}`);
    });
})
.catch((error) => {

    console.log(`\n✕ Something went wrong: ${error}`);
});