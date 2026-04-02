import express from "express";
import { body, param, validationResult, oneOf } from "express-validator";
import {
  createOrderHandler,
  getOrders,
  getOrder,
  updateStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { verifyJWT, authorize } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders - Authenticated user
router.post(
  "/",
  verifyJWT,
  [
    body("items").isArray({ min: 1 }).withMessage("Items required"),
    body("items.*.menuId").isMongoId().withMessage("Valid menu ID required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity >= 1"),
    body("totalPrice").isFloat({ min: 0 }).withMessage("Valid total price"),
    body("customerName")
      .trim()
      .notEmpty()
      .withMessage("Customer name required"),
    body("customerPhone").isMobilePhone().withMessage("Valid phone required"),
    body("customerEmail").isEmail().withMessage("Valid email required"),
    body("payment.method")
      .isIn(["cash", "card", "online"])
      .withMessage("Valid payment method"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  createOrderHandler,
);

// GET /api/orders - User own or admin all
router.get("/", verifyJWT, getOrders);

// GET /api/orders/:id - Own or admin
router.get(
  "/:id",
  verifyJWT,
  [param("id").isMongoId().withMessage("Invalid order ID")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  getOrder,
);

// PUT /api/orders/:id/status - Admin only
router.put(
  "/:id/status",
  verifyJWT,
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("status")
      .isIn(["pending", "preparing", "ready", "delivered", "cancelled"])
      .withMessage("Invalid status"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  updateStatus,
);

// DELETE /api/orders/:id - Cancel own (user) or admin
router.delete(
  "/:id",
  verifyJWT,
  [param("id").isMongoId().withMessage("Invalid order ID")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  cancelOrder,
);

export default router;
