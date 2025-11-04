import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId/add", addToCart);
router.put("/:userId/update/:productId", updateCartItem);
router.delete("/:userId/remove/:productId", removeFromCart); // Remove product
router.delete("/:userId/clear", clearCart); // Clear cart

export default router;
