import express from "express";
import corsMiddleware from "./middleware/corsMiddleware.js";
import router from "./routes/index.js";

const app = express();
const PORT = 5000;

// Global Middleware
app.use(corsMiddleware);
app.use(express.json());

// Main routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
