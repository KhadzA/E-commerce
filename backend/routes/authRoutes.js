import express from "express";
import { userLogin } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", userLogin); //I might need ID logics here later

export default router;
