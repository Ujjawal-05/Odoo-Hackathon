import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: Date,
});

export const Project = mongoose.model("Project", projectSchema);
