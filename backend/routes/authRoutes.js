import express from "express";
import {
  userLogin,
  userRegister,
  userLogout,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", userLogin); //I might need ID logics here later
router.get("/register", userRegister); //I might need ID logics here later
router.get("/logout", userLogout); //I might need ID logics here later

export default router;
