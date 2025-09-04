import express from "express";
import recordRoutes from "./recordRoutes.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Records routes
router.use("/records", recordRoutes);

export default router;
