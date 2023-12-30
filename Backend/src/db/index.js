import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {

    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("\n✓ DATABASE CONNECTED SUCCESSFULLY !!");

        console.log(`\n\t✓ DB-HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        
        console.log("\n✕ Error: Database Connection Failed !!\n\n✕ Error: ", error);

        throw error;
    }

}


export default connectDB;