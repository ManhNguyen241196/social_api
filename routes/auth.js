import express from "express";
import { register, login, logout, check } from "../controllers/auth.js";
const router = express.Router();

router.get("/login", check);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
