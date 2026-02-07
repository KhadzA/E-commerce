import express from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/:userId", getProfile);
router.post("/", createProfile); // for dummy testing
router.put("/:userId", updateProfile);

export default router;
