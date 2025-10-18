import express from "express";
import {
  userLogin,
  userRegister,
  userLogout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", userLogin); //I might need ID logics here later
router.post("/register", userRegister); //I might need ID logics here later
router.post("/logout", userLogout); //I might need ID logics here later

export default router;
