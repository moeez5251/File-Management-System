import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let accessToken = req.cookies.accessToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );

                req.user = decoded;
                return next();
            } catch (err) {
                if (err.name !== "TokenExpiredError") {
                    return res.status(401).json({ message: "Invalid access token" });
                }
            }
        }

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Login required" });
        }

        const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedRefresh.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        console.log("User found:", user);
        const newAccessToken = jwt.sign(    
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        req.user = {
            id: user._id,
            email: user.email,
        };

        return next();
    } catch (err) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};