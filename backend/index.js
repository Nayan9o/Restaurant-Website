import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

//middlewarws

app.use(express.json());
app.use(cors());
app.use(cookieParser());



const PORT = process.env.PORT || 5000;