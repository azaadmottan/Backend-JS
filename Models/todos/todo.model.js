import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        completeStatus: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        subTodo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {timestamps: true}
);

export const Todo = mongoose.model("Todo", todoSchema);