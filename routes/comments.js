import express from "express";
import { getComments, postComments } from "../controllers/comment.js";
const router = express.Router();

router.get("/", getComments);
router.post("/", postComments);

export default router;
