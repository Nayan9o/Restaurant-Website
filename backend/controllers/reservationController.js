import {
  createReservation,
  getUserReservations,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from "../services/reservationService.js";

export const createReservationHandler = async (req, res, next) => {
  try {
    const reservation = await createReservation(req.body, req.user._id);
    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const reservations =
      req.user.role === "admin"
        ? await getAllReservations(req.query)
        : await getUserReservations(req.user._id);
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservation = async (req, res, next) => {
  try {
    const reservation = await getReservationById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservationHandler = async (req, res, next) => {
  try {
    const reservation = await updateReservation(
      req.params.id,
      req.body,
      req.user._id,
    );
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservationHandler = async (req, res, next) => {
  try {
    await deleteReservation(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
