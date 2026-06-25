
import express from "express";
import { getallfiles, getbyid, rename,deletefile } from "../controllers/files.js";
const filesRouter = express.Router();

filesRouter.get("/all", getallfiles);
filesRouter.get("/byid", getbyid);
filesRouter.put("/rename/:id", rename);
filesRouter.delete("/delete/:id", deletefile);
export default filesRouter;
