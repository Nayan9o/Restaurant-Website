import Razorpay from "razorpay";
import crypto from "crypto";
import shortid from "shortid";
import Order from "../models/Order.js";
import { logger } from "../utils/logger.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: shortid.generate(),
  };
  const order = await razorpay.orders.create(options);
  logger.info(`Razorpay order created: ${order.id}`);
  return order;
};

export const verifyPaymentSignature = (order_id, payment_id, signature) => {
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${order_id}|${payment_id}`);
  const digest = shasum.digest("hex");
  return digest === signature;
};

export const updateOrderPayment = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  orderId,
) => {
  if (
    !verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    )
  ) {
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      "payment.status": "paid",
      razorpayOrderId,
      razorpayPaymentId,
    },
    { new: true },
  );
  if (!order) throw new Error("Order not found");

  logger.info(`Order ${orderId} payment updated to paid`);
  return order;
};

export const handlePaymentWebhook = async (event) => {
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    // Update order payment status
    // Implementation based on receipt or order reference
    logger.info(`Payment captured webhook: ${payment.id}`);
  }
};
