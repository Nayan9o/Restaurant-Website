import { v2 as cloudinary } from "cloudinary";
import { logger } from "../utils/logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileBuffer, folder = "restaurant/menu") => {
  try {
    const result = await cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) throw error;
          return result.secure_url;
        },
      )
      .end(fileBuffer);

    return result.secure_url;
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw error;
  }
};
