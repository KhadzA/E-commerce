import cors from "cors";

const corsMiddleware = cors({
  origin: "*", // allow all origins (change this later for security)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
});

export default corsMiddleware;
