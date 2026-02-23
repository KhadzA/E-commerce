import express from "express";
import {
  getOrders,
  getOrdersByUser,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/ordersList", getOrders); // GET all orders (admin)
router.get("/user/:userId", getOrdersByUser); // GET orders for a specific user
router.post("/", createOrder); // POST — place order + deduct stock

export default router;
