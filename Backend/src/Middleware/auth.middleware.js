import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = async (req, _, next) => {
    const token = req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        console.log("Token missing or Expired");
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-refreshToken -password");

        if (!user) {
            console.log("User not found");
        }

        req.user = user; // creating a new parameter called user in req and assigning it the user object.  
        next();
    } catch (error) {
        console.log(error);
    }

}