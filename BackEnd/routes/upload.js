import express from "express";
import upload from "../middleware/multer.js";
import { uploadFile } from "../controllers/upload.js";
const router = express.Router();

router.post("/file", upload.single("file"), uploadFile);


export default router;