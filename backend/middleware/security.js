import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import expressValidatorSanitizer from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import { logger } from "../utils/logger.js";

// Helmet with enhanced config
export const securityHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting - global
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Advanced rate limiting for auth
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many auth attempts" },
});

// CORS production ready
export const corsOptions = cors({
  origin:
    process.env.NODE_ENV === "production" ? "https://yourdomain.com" : true,
  credentials: true,
  optionsSuccessStatus: 204,
});

// NoSQL query injection protection
export const mongoSanitizer = expressValidatorSanitizer();

// XSS protection
export const xssProtection = xss();

// Parameter pollution protection
export const parameterPollution = hpp({
  whitelist: [],
});
