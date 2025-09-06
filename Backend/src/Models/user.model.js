import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    Projects: [ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
        } 
    ]
})

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) { return next(); };

    bcrypt.hash(this.password, 10)
        .then((hashedPassword) => {
            this.password = hashedPassword;
            next()
        })
        .catch((error) => {
            console.log("Error hashing password: ", error);
            next(error);
        });
})

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        const reselt = await bcrypt.compare(password, this.password);
        return reselt
    } catch (err) {
        console.error("Error comparing passwords:", err);
        return false;
    }
};

export const User = mongoose.model("User", userSchema)