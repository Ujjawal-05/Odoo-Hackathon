import { registerUser, loginUser, logoutUser } from "../Controllers/user.controller.js";
import {Router} from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router