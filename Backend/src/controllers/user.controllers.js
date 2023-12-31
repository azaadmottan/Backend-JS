import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


// generate refresh and access tokens.

const generateAccessAndRefreshTokens = async (userId) => {

    try {

        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        
        user.refreshToken = refreshToken;
        
        await user.save({ validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch (error) {

        throw new ApiError(500, "Something went wrong while generating refresh and access tokens.");
    }

};


// setup register-controller.

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
        password,
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


// setup login-controller.

const loginUser = asyncHandler( async (req, res) => {

    // get user-details: username, email & password.
    // find password.
    // access and refresh token.
    // send cookies.

    const { userName, email, password } = req.body;

    if (!(userName || email)) {

        throw new ApiError(400, "username or email is required.");
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    });

    if (!user) {

        throw new ApiError(404, "User doesn't exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {

        throw new ApiError(401, "Invalid user credentials.");
    }

    // console.log(generateAccessAndRefreshTokens(user._id));

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully."
        )
    )

});


// setup logout-controller.

const logoutUser = asyncHandler( async (req, res) => {

    await User.findByIdAndUpdate(
        
        req.user._id, 
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."));

});


// setup refreshAccess-token-controller

const refreshAccessToken = asyncHandler( async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;


    if (!incomingRefreshToken) {

        throw new ApiError(401, "Unauthorized request.");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
    
            throw new ApiError(401, "Invalid Refresh Token.");
        }
    
        if (incomingRefreshToken !== user?._id) {
    
            throw new ApiError(401, "Refresh token is expired.");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
    
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json (
            200, 
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed."
        )

    } catch (error) {
        
        throw new ApiError(401, error?.message || "Invalid Refresh Token.");
    }

});

export { registerUser, loginUser, logoutUser, refreshAccessToken };