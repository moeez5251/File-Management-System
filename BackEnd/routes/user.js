import express from "express"
import { createUser, loginUser,logout } from "../controllers/user.js";
const userroutes = express.Router();
userroutes.post("/createuser", createUser);
userroutes.post("/login", loginUser);
userroutes.post("/logout", logout);
export default userroutes