import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
dotenv.config();

const app = express();

//database
connectDB()

//middlewarws

app.use(express.json());
app.use(cors());
app.use(cookieParser());



const PORT = process.env.PORT || 5000;

app.get("/",(req,res) =>{
  res.send("hellow")
});

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
  console.log(` server is running on localhost${PORT}`)
})