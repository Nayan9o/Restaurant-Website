import {
  createRazorpayOrder,
  verifyPaymentSignature,
  updateOrderPayment,
  handlePaymentWebhook,
} from "../services/paymentService.js";
import { logger } from "../utils/logger.js";

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid amount required" });
    }
    const razorpayOrder = await createRazorpayOrder(amount);
    res.status(201).json({
      success: true,
      key_id: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (error) {
    logger.error(`Payment order creation error: ${error.message}`);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const order = await updateOrderPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: order,
    });
  } catch (error) {
    logger.error(`Payment verification error: ${error.message}`);
    next(error);
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const isValid = verifyPaymentSignature(
      req.body.razorpay_order_id,
      req.body.razorpay_payment_id,
      signature,
    );

    if (isValid) {
      await handlePaymentWebhook(req.body.event);
      res.status(200).json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid webhook signature" });
    }
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`);
    res.status(400).json({ success: false });
  }
};
