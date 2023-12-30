import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

    // res.status(200).json({

    //     message: "\n$ Success: User Register.",
    // })


    // get user details from frontend.

    // validation: check all fields are filled or empty.
    // check user is already exist or not: username , email.
    // check for image file, avatar or cover-images.
    // upload them to cloudinary: avatar or cover-images.
    // create a user object - create entry in database.
    // remove password and refresh-token from response.
    // check for user creation
    // return response.


    const { userName, fullName, email, password } = req.body;

    if (
        [ userName, fullName, email, password ].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    const userExisted = await User.findOne({

        $or: [ { userName }, { email } ]
    });

    if (userExisted) {
        throw new ApiError(409, "Username or email is already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {

        coverImageLocalPath = req.files.coverImage[0].path;
    }


    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
    });

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong, while registering the user.");
    }


    return res.status(201).json(
        
        new ApiResponse(200, userCreated, "User registered successfully.")
    );

});

export { registerUser };