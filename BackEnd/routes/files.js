
import express from "express";
import { getallfiles,getbyid } from "../controllers/files.js";
const filesRouter = express.Router();

filesRouter.get("/all", getallfiles);
filesRouter.get("/byid", getbyid);

export default filesRouter;
