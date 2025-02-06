import e from "express";
import multer from "multer";
import { authRouter } from "./routes/auth.js";
import { packageRouter } from "./routes/package.js";
import { userRouter } from "./routes/user.js";
import { depositRouter } from "./routes/deposit.js";

export const v1 = e.Router();
const upload = multer();

//-- api version 1

v1.get("/", (req, res) => {
  res.json({ success: true, message: "api version 1" });
});

//auth route
v1.use("/auth", upload.none(), authRouter);

//user route
v1.use("/user", userRouter);

//package route
v1.use("/package", packageRouter);

//deposit route
v1.use("/deposit", upload.none(), depositRouter);
