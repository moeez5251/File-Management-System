import express from "express"
import { createUser } from "../controllers/user.js";
const userroutes = express.Router();
userroutes.post("/createuser", createUser);

export default userroutes