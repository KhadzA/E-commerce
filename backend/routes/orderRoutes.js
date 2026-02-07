import express from "express";
import { getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/ordersList", getOrders); //This part should have a ID authorization for Single User Orders

export default router;
