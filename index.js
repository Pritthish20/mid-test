import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./configs/connectDB.js"
import attendenceRoute from './routes/attendence.route.js'
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

app.use('/api/v1/class',classRoute);
app.use('/api/v1/attendence',attendenceRoute);
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/student',studentRoute);

const PORT = env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
