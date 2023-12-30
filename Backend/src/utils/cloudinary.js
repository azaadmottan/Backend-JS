import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        
        // if the file path doesn't exist !!.

        if(!localFilePath) return null;

        // upload local file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath);

        // file uploaded on cloudinary successfully.

        console.log(`\nFile has been uploaded on cloudinary.\nResponse: ${response.url}`);

        return response;

    } catch (error) {
        
        fs.unlinkSync(localFilePath);

        // remove the locally saved temporary file from the local server as the upload operation got failed !!. 
        
        console.log(`\nFailed to upload file on cloudinary !!.\nError: ${error}`);

        return null;

    }
}

export { uploadOnCloudinary };
