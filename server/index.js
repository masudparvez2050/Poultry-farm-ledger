const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/poultry-farm-ledger";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Delivery Record Schema
const deliveryRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    truckId: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    weights: [
      {
        type: Number,
        required: true,
      },
    ],
    buckleNumber: {
      type: Number,
      default: 0,
    },
    buckleWeight: {
      type: Number,
      default: 0,
    },
    // Calculated fields
    grossWeight: {
      type: Number,
      required: true,
    },
    totalBuckleWeight: {
      type: Number,
      required: true,
    },
    netWeight: {
      type: Number,
      required: true,
    },
    averageWeight: {
      type: Number,
      required: true,
    },
    entryCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const DeliveryRecord = mongoose.model("DeliveryRecord", deliveryRecordSchema);

// Helper function to calculate fields
const calculateFields = (data) => {
  const entryCount = data.weights.length;
  const grossWeight = data.weights.reduce((sum, w) => sum + w, 0);
  const totalBuckleWeight = (data.buckleNumber || 0) * (data.buckleWeight || 0);
  const netWeight = grossWeight - totalBuckleWeight;
  const averageWeight = entryCount > 0 ? netWeight / entryCount : 0;

  return {
    entryCount,
    grossWeight,
    totalBuckleWeight,
    netWeight,
    averageWeight,
  };
};

// Routes

// GET all records
app.get("/api/records", async (req, res) => {
  try {
    const records = await DeliveryRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// POST new record
app.post("/api/records", async (req, res) => {
  try {
    const { date, truckId, invoiceNo, weights, buckleNumber, buckleWeight } =
      req.body;

    // Validate required fields
    if (
      !date ||
      !truckId ||
      !invoiceNo ||
      !weights ||
      !Array.isArray(weights)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate derived fields
    const calculatedFields = calculateFields({
      weights,
      buckleNumber,
      buckleWeight,
    });

    const newRecord = new DeliveryRecord({
      date,
      truckId,
      invoiceNo,
      weights,
      buckleNumber: buckleNumber || 0,
      buckleWeight: buckleWeight || 0,
      ...calculatedFields,
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error creating record:", error);
    res.status(500).json({ error: "Failed to create record" });
  }
});

// PUT update record
app.put("/api/records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, truckId, invoiceNo, weights, buckleNumber, buckleWeight } =
      req.body;

    // Validate required fields
    if (
      !date ||
      !truckId ||
      !invoiceNo ||
      !weights ||
      !Array.isArray(weights)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate derived fields
    const calculatedFields = calculateFields({
      weights,
      buckleNumber,
      buckleWeight,
    });

    const updatedRecord = await DeliveryRecord.findByIdAndUpdate(
      id,
      {
        date,
        truckId,
        invoiceNo,
        weights,
        buckleNumber: buckleNumber || 0,
        buckleWeight: buckleWeight || 0,
        ...calculatedFields,
      },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// DELETE record
app.delete("/api/records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await DeliveryRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Poultry Farm Ledger API is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
