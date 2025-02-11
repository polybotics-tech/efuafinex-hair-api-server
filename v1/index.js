import e from "express";
import { authRouter } from "./routes/auth.js";
import { packageRouter } from "./routes/package.js";
import { userRouter } from "./routes/user.js";
import { depositRouter } from "./routes/deposit.js";
import { adminRouter } from "./routes/admin/index.js";

export const v1 = e.Router();

//-- api version 1

v1.get("/", (req, res) => {
  res.json({ success: true, message: "api version 1" });
});

//auth route
v1.use("/auth", authRouter);

//user route
v1.use("/user", userRouter);

//package route
v1.use("/package", packageRouter);

//deposit route
v1.use("/deposit", depositRouter);

//admin route
v1.use("/admin", adminRouter);
