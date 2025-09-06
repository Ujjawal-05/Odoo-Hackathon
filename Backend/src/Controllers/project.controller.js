import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { Project } from "../Models/project.model.js";

const createProject = async (req, res) => {
  try {
    const { name, description, deadline, members } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Members must be a non-empty array of user names",
      });
    }

    console.log("Members received:", members);

    const foundUsers = await User.find({
      name: { $in: members.map((m) => new RegExp(`^${m}$`, "i")) },
    }).select("_id name");

    if (foundUsers.length !== members.length) {
      const foundNames = foundUsers.map((u) => u.name);
      const missing = members.filter((m) => !foundNames.includes(m));
      return res.status(404).json({
        success: false,
        message: `These users were not found: ${missing.join(", ")}`,
      });
    }

    const memberIds = foundUsers.map((u) => u._id);

    const project = await Project.create({
      name,
      description,
      owner: user._id,
      users: memberIds, 
      deadline,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { Projects: project._id },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message
: "Error creating project" });
  }
};

export { createProject };
