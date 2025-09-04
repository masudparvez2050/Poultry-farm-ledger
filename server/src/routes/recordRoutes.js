import express from "express";
import {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordsStats,
} from "../controllers/index.js";
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

  validateCreateRecord,
  validateUpdateRecord,
  validateGetRecord,
  validateDeleteRecord,
  validateQueryParams,
} from "../middleware/index.js";

const router = express.Router();

// @route   GET /api/v1/records/stats
router.get("/stats", getRecordsStats);

// @route   GET /api/v1/records
router.get("/", validateQueryParams, getRecords);

// @route   GET /api/v1/records/:id
router.get("/:id", validateGetRecord, getRecord);

// @route   POST /api/v1/records
router.post("/", validateCreateRecord, createRecord);

// @route   PUT /api/v1/records/:id
router.put("/:id", validateUpdateRecord, updateRecord);

// @route   DELETE /api/v1/records/:id
router.delete("/:id", validateDeleteRecord, deleteRecord);

export default router;
