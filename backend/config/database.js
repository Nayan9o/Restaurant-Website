import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error("MONGODB_URI not configured in .env file");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
