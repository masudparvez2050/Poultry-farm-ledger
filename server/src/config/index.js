import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database Configuration
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/poultry-farm-ledger",

  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || "/api/v1",

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Rate Limiting Configuration
  RATE_LIMIT_WINDOW_MS:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // Security
  TRUST_PROXY: process.env.NODE_ENV === "production",
};

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

export default config;
