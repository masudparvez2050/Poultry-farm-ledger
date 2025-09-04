import { DeliveryRecord } from "../models/index.js";
import { validationResult } from "express-validator";

// @desc    Get all delivery records
// @route   GET /api/v1/records
// @access  Public
export const getRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { truckId: { $regex: search, $options: "i" } },
        { invoiceNo: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await DeliveryRecord.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await DeliveryRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRecords: total,
        hasNext: skip + records.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch records",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single delivery record by ID
// @route   GET /api/v1/records/:id
// @access  Public
export const getRecord = async (req, res) => {
  try {
    const record = await DeliveryRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch record",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new delivery record
// @route   POST /api/v1/records
// @access  Public
export const createRecord = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const record = await DeliveryRecord.create(req.body);

    res.status(201).json({
      success: true,
      data: record,
      message: "Record created successfully",
    });
  } catch (error) {
    console.error("Error creating record:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate value for ${field}`,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create record",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update delivery record
// @route   PUT /api/v1/records/:id
// @access  Public
export const updateRecord = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const record = await DeliveryRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("Error updating record:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update record",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete delivery record
// @route   DELETE /api/v1/records/:id
// @access  Public
export const deleteRecord = async (req, res) => {
  try {
    const record = await DeliveryRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete record",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get records statistics
// @route   GET /api/v1/records/stats
// @access  Public
export const getRecordsStats = async (req, res) => {
  try {
    const stats = await DeliveryRecord.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalGrossWeight: { $sum: "$grossWeight" },
          totalNetWeight: { $sum: "$netWeight" },
          averageGrossWeight: { $avg: "$grossWeight" },
          averageNetWeight: { $avg: "$netWeight" },
          maxGrossWeight: { $max: "$grossWeight" },
          minGrossWeight: { $min: "$grossWeight" },
        },
      },
    ]);

    const result =
      stats.length > 0
        ? stats[0]
        : {
            totalRecords: 0,
            totalGrossWeight: 0,
            totalNetWeight: 0,
            averageGrossWeight: 0,
            averageNetWeight: 0,
            maxGrossWeight: 0,
            minGrossWeight: 0,
          };

    // Remove the _id field
    delete result._id;

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
