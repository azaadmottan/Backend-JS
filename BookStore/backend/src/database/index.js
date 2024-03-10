import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDataBase = async () => {

    try {
    
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\n✓ Database connected successfully !`);
        console.log(`\nDB_HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        
        console.log(`\n✕ Error connecting to database: ${error}`);
    }
}

export default connectDataBase;