import mongoose from 'mongoose';

const subTodoSchema = new mongoose.Schema(
    {
        subContent: {
            type: String,
            required: true
        },
        completeStatus: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }
    },
    {}
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);