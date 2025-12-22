import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.get("/", (res, req) => {
  res.send("Server is running fine .....");
});

app.use(express.json);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server is up and running one port ${PORT}`)
);
