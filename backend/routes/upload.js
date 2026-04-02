import express from "express";
import { uploadImageController } from "../controllers/uploadController.js";

const router = express.Router();

// POST /api/upload/image - Admin only
router.post("/image", uploadImageController);

export default router;
