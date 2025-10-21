import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Routes
router.get("/", getProducts); // GET all products
router.get("/:id", getProductById); // GET single product by ID
router.post("/", addProduct); // CREATE new product
router.put("/:id", updateProduct); // UPDATE product
router.delete("/:id", deleteProduct); // DELETE product

export default router;
