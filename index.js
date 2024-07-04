import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
const app = express();
dotenv.config();
app.use(express.json());
const PORT = 3000;
app.use(cookieParser());

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

//IMPORT
import listingRouter from "./Routes/listing.route.js";
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
//IMPORT

//AppUsing
app.use("/api/listing", listingRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
//AppUsing

mongoose.connect("mongodb://127.0.0.1:27017/ForProject").then(() => {
  console.log("Connected to the Mongodb Dbs");
});
app.get("/", (req, res) => {
  res.json({
    message: "Connected",
  });
});
app.listen(PORT, () => {
  console.log(`Connected to the port no ${PORT}`);
});

//Custom Error Handler
app.use((err, req, res, nexr) => {
  const Statuscode = err.Statuscode || 500;
  const message = err.message || "Internal Server Error";
  return res.json({
    success: false,
    Statuscode,
    message,
  });
});
//Custom Error Handler
