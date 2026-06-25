import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userroutes from "./routes/user.js";
import router from "./routes/upload.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import filesRouter from "./routes/files.js";

dotenv.config();

const app = express();
const unprotectedRoutes = ["/api/user/login", "/api/user/register","/","/api/files/all"];


const allowedOrigins = process.env.ORIGINS
    ? process.env.ORIGINS.replace(/[\[\]']/g, "").split(",").map(o => o.trim())
    : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    if (unprotectedRoutes.includes(req.path)) {
        next();
    } else {
        authMiddleware(req, res, next);
    }
});

connectDB();

app.use("/api/user", userroutes);
app.use("/api/upload", router);
app.use("/api/files", filesRouter);
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));