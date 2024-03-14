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

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto"});

        // file uploaded on cloudinary successfully.

        // console.log(`\n✓ File has been uploaded on cloudinary.\n\t✓ Response: ${response.url}`);

        fs.unlinkSync(localFilePath);


        return response;

    } catch (error) {
        
        fs.unlinkSync(localFilePath);

        // remove the locally saved temporary file from the local server as the upload operation got failed !!. 
        
        console.log(`\n✕ Failed to upload file on cloudinary !!.\n\t✕ Error: ${error}`);

        return null;

    }
}

const deleteOnCloudinary = async (public_id, resource_type="image") => {

    try {
        if (!public_id) return null;

        const response = await cloudinary.uploader.destroy(public_id, { resource_type: `${resource_type}`});

        return response;
    } catch (error) {
        return error;
    }
}

export { uploadOnCloudinary, deleteOnCloudinary };
