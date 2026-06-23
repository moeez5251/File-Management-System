import express from "express"
import { createUser, loginUser } from "../controllers/user.js";
const userroutes = express.Router();
userroutes.post("/createuser", createUser);
userroutes.post("/login", loginUser);
export default userroutes