import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userroutes from "./routes/user.js";
import router from "./routes/upload.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
dotenv.config();

const app = express();
const unprotectedRoutes = ["/api/user/login", "/api/user/register"];

// app.use((req, res, next) => {
//     if (unprotectedRoutes.includes(req.url)) {
//         next();
//     } else {
//         authMiddleware(req, res, next);
//     }
// });
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userroutes);
app.use("/api/upload", router);
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));