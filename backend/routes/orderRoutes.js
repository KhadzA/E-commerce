import express from "express";
import { getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id/orders", getOrders);

export default router;
