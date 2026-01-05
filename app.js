import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./configs/connectDB.js"
import attendenceRoute from './routes/attendance.route.js'
import classRoute from './routes/class.route.js'
import authRoute from './routes/auth.route.js'
import studentRoute from './routes/student.route.js'
import { env } from "./configs/envSchema.js";


connectDB()
const app = express();

app.get("/", (req, res) => {
  res.send("Server is running fine .....");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

app.use('/class',classRoute);
app.use('/attendance',attendenceRoute);
app.use('/auth',authRoute);
app.use('/students',studentRoute);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

export default app;