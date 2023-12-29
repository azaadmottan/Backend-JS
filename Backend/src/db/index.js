import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {

    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("\nDATABASE CONNECTED SUCCESSFULLY !!");

        console.log(`\nDB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        
        console.log("\nError: Database Connection Failed !! \nError: ", error);

        throw error;
    }

}


export default connectDB;