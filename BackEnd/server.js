import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userroutes from "./routes/user.js";
import router from "./routes/upload.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import filesRouter from "./routes/files.js";
import File from "./models/file.js";
import io from "./models/socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
io.attach(httpServer);
const unprotectedRoutes = ["/api/user/login", "/api/user/createuser","/","/api/files/all"]
const unprotectedPrefixes = [
  "/api/files/share/",
];


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
  const isUnprotected =
    unprotectedRoutes.includes(req.path) ||
    unprotectedPrefixes.some(prefix => req.path.startsWith(prefix));

  if (isUnprotected) {
    return next();
  }

  return authMiddleware(req, res, next);
});

connectDB();

const changeStream = File.watch([], {
  fullDocument: "updateLookup",
});

changeStream.on("change", (change) => {
  io.emit("filesUpdated", change);
});
app.use("/api/user", userroutes);
app.use("/api/upload", router);
app.use("/api/files", filesRouter);
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));