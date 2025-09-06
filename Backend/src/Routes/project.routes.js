import { createProject } from "../Controllers/project.controller.js"
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT,createProject)

export default router