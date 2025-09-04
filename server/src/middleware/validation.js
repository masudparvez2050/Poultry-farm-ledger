import { body, param, query } from "express-validator";

// Validation rules for creating a new record
export const validateCreateRecord = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in valid ISO format"),

  body("truckId")
    .notEmpty()
    .withMessage("Truck ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Truck ID must be between 1 and 50 characters")
    .trim(),

  body("invoiceNo")
    .notEmpty()
    .withMessage("Invoice number is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invoice number must be between 1 and 50 characters")
    .trim(),

  body("weights")
    .isArray({ min: 1 })
    .withMessage("Weights must be an array with at least one element")
    .custom((weights) => {
      if (
        !weights.every((weight) => typeof weight === "number" && weight > 0)
      ) {
        throw new Error("All weights must be positive numbers");
      }
      return true;
    }),

  body("buckleNumber")
    .isNumeric()
    .withMessage("Buckle number must be a number")
    .isFloat({ min: 0 })
    .withMessage("Buckle number must be non-negative"),

  body("buckleWeight")
    .isNumeric()
    .withMessage("Buckle weight must be a number")
    .isFloat({ min: 0 })
    .withMessage("Buckle weight must be non-negative"),
];

// Validation rules for updating a record
export const validateUpdateRecord = [
  param("id").isMongoId().withMessage("Invalid record ID"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be in valid ISO format"),

  body("truckId")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Truck ID must be between 1 and 50 characters")
    .trim(),

  body("invoiceNo")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Invoice number must be between 1 and 50 characters")
    .trim(),

  body("weights")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Weights must be an array with at least one element")
    .custom((weights) => {
      if (
        weights &&
        !weights.every((weight) => typeof weight === "number" && weight > 0)
      ) {
        throw new Error("All weights must be positive numbers");
      }
      return true;
    }),

  body("buckleNumber")
    .optional()
    .isNumeric()
    .withMessage("Buckle number must be a number")
    .isFloat({ min: 0 })
    .withMessage("Buckle number must be non-negative"),

  body("buckleWeight")
    .optional()
    .isNumeric()
    .withMessage("Buckle weight must be a number")
    .isFloat({ min: 0 })
    .withMessage("Buckle weight must be non-negative"),
];

// Validation rules for getting a single record
export const validateGetRecord = [
  param("id").isMongoId().withMessage("Invalid record ID"),
];

// Validation rules for deleting a record
export const validateDeleteRecord = [
  param("id").isMongoId().withMessage("Invalid record ID"),
];

// Validation rules for query parameters
export const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn([
      "date",
      "truckId",
      "invoiceNo",
      "grossWeight",
      "netWeight",
      "createdAt",
    ])
    .withMessage("Invalid sortBy field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either asc or desc"),

  query("search")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Search term must be between 1 and 50 characters")
    .trim(),
];
