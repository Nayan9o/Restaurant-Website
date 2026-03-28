import express from "express";
import { adminLogin, loginUser, registerUser } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register",registerUser)
authRoutes.post("/login",loginUser)
authRoutes.post("/admin/login",adminLogin)

export default authRoutes