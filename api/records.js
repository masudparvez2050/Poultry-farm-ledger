const connectDB = require("./lib/mongodb");
const DeliveryRecord = require("./models/DeliveryRecord");

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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    await connectDB();

    switch (req.method) {
      case "GET":
        // Get all records
        try {
          const records = await DeliveryRecord.find().sort({ date: -1 });
          res.status(200).json(records);
        } catch (error) {
          console.error("Error fetching records:", error);
          res.status(500).json({ error: "Failed to fetch records" });
        }
        break;

      case "POST":
        // Create new record
        try {
          const {
            date,
            truckId,
            invoiceNo,
            weights,
            buckleNumber,
            buckleWeight,
          } = req.body;

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
        break;

      default:
        res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};
