import mongoose from "mongoose";

const deliveryRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    truckId: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceNo: {
      type: String,
      required: true,
      trim: true,
    },
    weights: {
      type: [Number],
      required: true,
      validate: {
        validator: function (weights) {
          return weights.length > 0 && weights.every((weight) => weight > 0);
        },
        message: "Weights array must contain at least one positive number",
      },
    },
    buckleNumber: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    buckleWeight: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // Calculated fields
    grossWeight: {
      type: Number,
      default: 0,
    },
    totalBuckleWeight: {
      type: Number,
      default: 0,
    },
    netWeight: {
      type: Number,
      default: 0,
    },
    averageWeight: {
      type: Number,
      default: 0,
    },
    entryCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save middleware to calculate derived fields
deliveryRecordSchema.pre("save", function (next) {
  if (this.weights && this.weights.length > 0) {
    this.entryCount = this.weights.length;
    this.grossWeight = this.weights.reduce((sum, weight) => sum + weight, 0);
    this.totalBuckleWeight =
      (this.buckleNumber || 0) * (this.buckleWeight || 0);
    this.netWeight = this.grossWeight - this.totalBuckleWeight;
    this.averageWeight =
      this.entryCount > 0 ? this.netWeight / this.entryCount : 0;
  }
  next();
});

// Pre-findOneAndUpdate middleware to calculate derived fields
deliveryRecordSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();

  if (update.weights && Array.isArray(update.weights)) {
    const entryCount = update.weights.length;
    const grossWeight = update.weights.reduce((sum, weight) => sum + weight, 0);
    const totalBuckleWeight =
      (update.buckleNumber || 0) * (update.buckleWeight || 0);
    const netWeight = grossWeight - totalBuckleWeight;
    const averageWeight = entryCount > 0 ? netWeight / entryCount : 0;

    this.setUpdate({
      ...update,
      entryCount,
      grossWeight,
      totalBuckleWeight,
      netWeight,
      averageWeight,
    });
  }

  next();
});

// Indexes for better performance
deliveryRecordSchema.index({ date: -1 });
deliveryRecordSchema.index({ truckId: 1 });
deliveryRecordSchema.index({ invoiceNo: 1 });
deliveryRecordSchema.index({ createdAt: -1 });

const DeliveryRecord = mongoose.model("DeliveryRecord", deliveryRecordSchema);

export default DeliveryRecord;
