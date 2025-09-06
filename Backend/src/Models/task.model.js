import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
    title: String,
    description: String,
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: Date
})

export const Task = mongoose.model("Task", taskSchema)