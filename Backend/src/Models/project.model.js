import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema({
    name: String,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    deadline: Date
})

export const Task = mongoose.model("Project", projectSchema)