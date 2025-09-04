import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { body } from "express-validator";

import config from "./config/index.js";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/index.js";

const app = express();

// Trust proxy if in production (required for Vercel)
if (config.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.CORS_ORIGIN.split(",").map((origin) =>
      origin.trim()
    );

    // In development, allow any localhost origin
    if (config.NODE_ENV === "development" && origin.includes("localhost")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint (before API routes)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: "1.0.0",
  });
});

// API routes
app.use(config.API_BASE_URL, routes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Poultry Farm Ledger API",
    version: "1.0.0",
    environment: config.NODE_ENV,
    endpoints: {
      health: "/health",
      api: config.API_BASE_URL,
      records: `${config.API_BASE_URL}/records`,
      stats: `${config.API_BASE_URL}/records/stats`,
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const PORT = config.PORT;
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${config.NODE_ENV} mode
🌐 Server URL: http://localhost:${PORT}
📊 API Base URL: ${config.API_BASE_URL}
🔗 Health Check: http://localhost:${PORT}/health
📁 Records API: http://localhost:${PORT}${config.API_BASE_URL}/records
      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal received");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
