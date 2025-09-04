const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/poultry-farm-ledger";

// Schema (same as server)
const deliveryRecordSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    truckId: { type: String, required: true },
    invoiceNo: { type: String, required: true },
    weights: [{ type: Number, required: true }],
    buckleNumber: { type: Number, default: 0 },
    buckleWeight: { type: Number, default: 0 },
    grossWeight: { type: Number, required: true },
    totalBuckleWeight: { type: Number, required: true },
    netWeight: { type: Number, required: true },
    averageWeight: { type: Number, required: true },
    entryCount: { type: Number, required: true },
  },
  { timestamps: true }
);

const DeliveryRecord = mongoose.model("DeliveryRecord", deliveryRecordSchema);

// Sample data for demo (you can replace this with data from your localStorage)
const sampleData = [
  {
    date: "2025-01-01",
    truckId: "GK-114",
    invoiceNo: "151775",
    weights: [56.7, 58.2, 55.9, 57.4, 59.1, 56.3, 58.7, 57.8, 55.6, 58.9],
    buckleNumber: 5,
    buckleWeight: 8,
  },
  {
    date: "2025-01-02",
    truckId: "GK-115",
    invoiceNo: "151776",
    weights: [54.3, 56.8, 57.2, 55.7, 58.4, 56.1, 57.9, 56.5, 55.8, 57.6],
    buckleNumber: 4,
    buckleWeight: 7.5,
  },
  {
    date: "2025-01-03",
    truckId: "GK-116",
    invoiceNo: "151777",
    weights: [59.2, 58.7, 57.3, 56.9, 60.1, 58.5, 57.8, 59.4, 58.1, 57.7],
    buckleNumber: 6,
    buckleWeight: 8.5,
  },
];

// Helper function to calculate derived fields
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

async function migrateData() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    // Clear existing data
    console.log("🗑️ Clearing existing records...");
    await DeliveryRecord.deleteMany({});

    // Insert sample data
    console.log("📝 Inserting sample data...");
    for (const record of sampleData) {
      const calculatedFields = calculateFields(record);
      const newRecord = new DeliveryRecord({
        ...record,
        ...calculatedFields,
      });
      await newRecord.save();
      console.log(`✅ Added record: ${record.truckId} - ${record.invoiceNo}`);
    }

    console.log("🎉 Migration completed successfully!");
    console.log(`📊 Inserted ${sampleData.length} records`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run migration
migrateData();
