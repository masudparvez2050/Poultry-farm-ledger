const mongoose = require("mongoose");

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
    timestamps: true,
  }
);

module.exports =
  mongoose.models.DeliveryRecord ||
  mongoose.model("DeliveryRecord", deliveryRecordSchema);
