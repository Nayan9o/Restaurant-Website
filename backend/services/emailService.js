import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Restaurant Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error to ${to}: ${error.message}`);
    throw error;
  }
};

export const sendOrderConfirmation = async (order) => {
  const html = `
    <h2>Order #${order._id} Confirmed!</h2>
    <p>Dear ${order.customerName},</p>
    <p>Your order is <strong>${order.status.toUpperCase()}</strong></p>
    <p>Total: ₹${order.totalPrice}</p>
    <p>Items: ${order.items.map((item) => `${item.quantity}x ${item.name}`).join("<br>")}</p>
    <p>Thank you for choosing us!</p>
  `;
  await sendEmail(order.customerEmail, `Order #${order._id} - Confirmed`, html);
};

export const sendOrderStatusUpdate = async (order, oldStatus) => {
  const html = `
    <h2>Order #${order._id} Status Update</h2>
    <p>Your order status changed from ${oldStatus} to <strong>${order.status.toUpperCase()}</strong></p>
    <p>Total: ₹${order.totalPrice}</p>
    <p>Thank you!</p>
  `;
  await sendEmail(
    order.customerEmail,
    `Order #${order._id} Status Updated`,
    html,
  );
};

export const sendReservationConfirmation = async (reservation) => {
  const html = `
    <h2>Reservation Confirmed!</h2>
    <p>Dear ${reservation.customerName},</p>
    <p>Reservation #${reservation._id} for ${reservation.date} ${reservation.time}</p>
    <p>Guests: ${reservation.guests}</p>
    <p>Special requests: ${reservation.specialRequests || "None"}</p>
    <p>We look forward to serving you!</p>
  `;
  await sendEmail(
    reservation.customerEmail,
    `Reservation #${reservation._id} Confirmed`,
    html,
  );
};
