import express from "express";
import { getLikes, postLikes, deleteLikes } from "../controllers/like.js";
const router = express.Router();

router.get("/", getLikes);
router.post("/", postLikes);
router.delete("/", deleteLikes);

export default router;
