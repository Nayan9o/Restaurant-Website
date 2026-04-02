import Order from "../models/Order.js";
import { logger } from "../utils/logger.js";
import { sendOrderConfirmation } from "../services/emailService.js";

export const createOrder = async (orderData, userId) => {
  const order = new Order({ ...orderData, userId });
  await order.save();
  logger.info(`Order created: ${order._id} by user: ${userId}`);
  await sendOrderConfirmation(order);
  return await Order.findById(order._id).populate("items.menuId").lean();
};

export const getUserOrders = async (userId, filters = {}) => {
  const query = { userId, ...filters };
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("items.menuId")
    .lean();
  return orders;
};

export const getAllOrders = async (filters = {}) => {
  const query = { ...filters };
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("items.menuId")
    .lean();
  return orders;
};

export const getOrderById = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId; // Users only own orders
  const order = await Order.findOne(query).populate("items.menuId").lean();
  if (!order) throw new Error(`Order not found: ${id}`);
  return order;
};

export const updateOrderStatus = async (id, status) => {
  const validStatuses = [
    "pending",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  )
    .populate("items.menuId")
    .lean();

  if (!order) throw new Error(`Order not found: ${id}`);
  logger.info(`Order ${id} status updated to ${status}`);
  return order;
};

export const deleteOrder = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const order = await Order.findOneAndDelete(query);
  if (!order) throw new Error(`Order not found: ${id}`);
  logger.info(`Order deleted: ${id} by user: ${userId || "admin"}`);
  return { success: true, message: "Order deleted successfully" };
};
