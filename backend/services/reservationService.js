import Reservation from "../models/Reservation.js";
import { logger } from "../utils/logger.js";
import { sendReservationConfirmation } from "../services/emailService.js";

export const createReservation = async (reservationData, userId) => {
  const now = new Date();
  const reservationDate = new Date(reservationData.date);
  if (reservationDate <= now) {
    throw new Error("Reservation date must be in the future");
  }
  const reservation = new Reservation({ ...reservationData, userId });
  await reservation.save();
  logger.info(
    `Reservation created: ${reservation._id} for ${reservationDate.toDateString()}`,
  );
  await sendReservationConfirmation(reservation);
  return reservation;
};

export const getUserReservations = async (userId) => {
  const reservations = await Reservation.find({ userId })
    .sort({ date: 1, time: 1 })
    .lean();
  return reservations;
};

export const getAllReservations = async (filters = {}) => {
  const query = { ...filters };
  const reservations = await Reservation.find(query)
    .sort({ date: 1, time: 1 })
    .lean();
  return reservations;
};

export const getReservationById = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const reservation = await Reservation.findOne(query).lean();
  if (!reservation) throw new Error(`Reservation not found: ${id}`);
  return reservation;
};

export const updateReservation = async (id, updateData, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const reservation = await Reservation.findOneAndUpdate(
    query,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();
  if (!reservation) throw new Error(`Reservation not found: ${id}`);
  logger.info(`Reservation ${id} updated`);
  return reservation;
};

export const deleteReservation = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const reservation = await Reservation.findOneAndDelete(query);
  if (!reservation) throw new Error(`Reservation not found: ${id}`);
  logger.info(`Reservation deleted: ${id}`);
  return { success: true, message: "Reservation deleted successfully" };
};
