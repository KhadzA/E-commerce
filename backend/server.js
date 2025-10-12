import express from "express";
import corsMiddleware from "./middleware/corsMiddleware.js";
import authentication from "./routes/authRoutes.js";
import userCart from "./routes/cartRoutes.js";
import userOrders from "./routes/orderRoutes.js";
import products from "./routes/productRoutes.js";
import userProfile from "./routes/profileRoutes.js";

const app = express();
const PORT = 5000;

// Global Middleware
app.use(corsMiddleware);
app.use(express.json());

// Main routes
app.use("/auth", authentication);
app.use("/cart", userCart);
app.use("/orders", userOrders);
app.use("/products", products);
app.use("/profile", userProfile);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
