import upload from "../middleware/upload.js";
import { uploadImage } from "../services/uploadService.js";
import { verifyJWT, authorize } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

export const uploadImageController = [
  verifyJWT,
  authorize("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const imageUrl = await uploadImage(req.file.buffer, "restaurant/menu");

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl,
      });
    } catch (error) {
      logger.error(`Upload error: ${error.message}`);
      next(error);
    }
  },
];
