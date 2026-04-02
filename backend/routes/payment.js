import express from "express";
import { body } from "express-validator";
import {
  createPaymentOrder,
  verifyPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// POST /api/payment/orders - Create Razorpay order
router.post(
  "/orders",
  [body("amount").isFloat({ min: 1 }).withMessage("Amount > 0 required")],
  createPaymentOrder,
);

// POST /api/payment/verify - Frontend verification
router.post(
  "/verify",
  [
    body("razorpay_order_id").notEmpty(),
    body("razorpay_payment_id").notEmpty(),
    body("razorpay_signature").notEmpty(),
    body("orderId").isMongoId(),
  ],
  verifyPayment,
);

// POST /api/payment/webhook - Razorpay webhook
router.post("/webhook", paymentWebhook);

export default router;
