import { DeliveryRecord } from "../server/src/models/index.js";
import connectDB from "../server/src/config/database.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../server/.env" });

/**
 * Migration script to transfer data from localStorage to MongoDB
 * This script should be run once to migrate existing data
 */

const migrateData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Sample data that would typically come from localStorage
    // Replace this with actual data from your localStorage
    const sampleData = [
      {
        date: "2025-09-01",
        truckId: "TR001",
        invoiceNo: "INV001",
        weights: [45.5, 42.3, 48.1, 44.7],
        buckleNumber: 4,
        buckleWeight: 0.5,
      },
      {
        date: "2025-09-02",
        truckId: "TR002",
        invoiceNo: "INV002",
        weights: [50.2, 48.8, 51.1],
        buckleNumber: 3,
        buckleWeight: 0.6,
      },
    ];

    console.log("Starting data migration...");

    for (const recordData of sampleData) {
      try {
        const record = new DeliveryRecord(recordData);
        await record.save();
        console.log(`Migrated record: ${record.invoiceNo}`);
      } catch (error) {
        console.error(
          `Failed to migrate record ${recordData.invoiceNo}:`,
          error
        );
      }
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export default migrateData;
