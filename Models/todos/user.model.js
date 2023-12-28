import mongoose from 'mongoose';

// mongoose.Schema({}, {}) take 'two objects' "first object" define the structure of the schema and the "second object" represent the 'time' of data when the data is 'inserted' or 'updated'.

const userNameSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            min: [8, 'Password must be at least 8-characters.']
        }
    },
    {timestamps: true}      // 1. createdAt 2. updatedAt 
);

// when the model is created by mongoDB they convert the schema name to 'lowercase' and 'pluralized' name of the schema.

// i.e if the name of the schema in 'PascalCase' they convert to 'lowercase' and also they convert name of the schema to 'pluralized' form eg.  "User" to "users".

export const User = mongoose.model("User", userNameSchema);