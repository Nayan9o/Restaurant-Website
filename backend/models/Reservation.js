import mongoose from "mongoose";

const reservationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    customerPhone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number"],
    },
    customerEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest required"],
      max: [20, "Maximum 20 guests per reservation"],
    },
    date: {
      type: Date,
      required: [true, "Reservation date is required"],
      // Can add virtual to check future date
    },
    time: {
      type: String,
      required: [true, "Reservation time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time must be HH:MM format (24hr)",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for future date check
reservationSchema.virtual("isFuture").get(function () {
  return this.date > new Date();
});

// Indexes
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ userId: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
