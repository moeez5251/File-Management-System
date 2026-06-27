
import express from "express";
import { getallfiles, getbyid, rename,deletefile,shared } from "../controllers/files.js";
const filesRouter = express.Router();

filesRouter.get("/all", getallfiles);
filesRouter.get("/byid", getbyid);
filesRouter.put("/rename/:id", rename);
filesRouter.delete("/delete/:id", deletefile);
filesRouter.get("/share/:id", shared);
export default filesRouter;
