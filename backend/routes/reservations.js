import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  createReservationHandler,
  getReservations,
  getReservation,
  updateReservationHandler,
  deleteReservationHandler,
} from "../controllers/reservationController.js";
import { verifyJWT, authorize } from "../middleware/auth.js";

const router = express.Router();

// POST /api/reservations - Authenticated user
router.post(
  "/",
  verifyJWT,
  [
    body("customerName").trim().notEmpty().withMessage("Name required"),
    body("customerPhone")
      .matches(/^\+?[\d\s-()]{10,}$/)
      .withMessage("Valid phone"),
    body("customerEmail").isEmail().withMessage("Valid email required"),
    body("guests").isInt({ min: 1, max: 20 }).withMessage("Guests 1-20"),
    body("date")
      .isISO8601()
      .toDate()
      .custom((value) => {
        if (value <= new Date()) return Promise.reject("Future date only");
        return true;
      }),
    body("time")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("HH:MM 24hr format"),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes too long"),
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
  createReservationHandler,
);

// GET /api/reservations - Own (user) or all (admin)
router.get("/", verifyJWT, getReservations);

// GET /api/reservations/:id
router.get(
  "/:id",
  verifyJWT,
  [param("id").isMongoId().withMessage("Invalid ID")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
  getReservation,
);

// PUT /api/reservations/:id - Own or admin
router.put(
  "/:id",
  verifyJWT,
  [
    param("id").isMongoId().withMessage("Invalid ID"),
    body("status")
      .optional()
      .isIn(["pending", "confirmed", "cancelled", "completed"]),
    // other optional fields...
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
  updateReservationHandler,
);

// DELETE /api/reservations/:id - Own or admin
router.delete(
  "/:id",
  verifyJWT,
  [param("id").isMongoId().withMessage("Invalid ID")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
  deleteReservationHandler,
);

export default router;
