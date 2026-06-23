import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import  userroutes  from "./routes/user.js";
dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/api/user", userroutes);
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));