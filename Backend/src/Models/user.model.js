import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    Projects: {
        type:[{type: mongoose.Schema.Types.ObjectId,
        ref: "Project"}],
        default: []
    }
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

userSchema.methods.generateAccessTokens = function () {
    //short lived accesss tokens
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.usename
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    )

}
userSchema.methods.generateRefreshTokens = function () {
    //long lived refresh tokens
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

}

export const User = mongoose.model("User", userSchema)