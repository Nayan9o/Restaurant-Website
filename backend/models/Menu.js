import mongoose from "mongoose";

const menuSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["appetizer", "main", "dessert", "beverage", "special"],
        message: "Invalid category",
      },
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
menuSchema.index({ category: 1 });
menuSchema.index({ isAvailable: 1 });
menuSchema.index({ name: "text", description: "text" });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
