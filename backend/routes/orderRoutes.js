import express from "express";
import { getOrders, createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/ordersList", getOrders); // GET all orders
router.post("/", createOrder); // POST — place order + deduct stock

export default router;
