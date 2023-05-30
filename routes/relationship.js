import express from "express";
import {
  postRelation,
  deleteRelation,
  getRelation,
} from "../controllers/relationship.js";
const router = express.Router();

router.get("/", getRelation);
router.post("/", postRelation);
router.delete("/", deleteRelation);

export default router;
