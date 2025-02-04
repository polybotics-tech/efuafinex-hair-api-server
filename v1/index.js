import e from "express";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";

export const v1 = e.Router();

//-- api version 1

v1.get("/", (req, res) => {
  res.json({ success: true, message: "api version 1" });
});

//auth route
v1.use("/auth", authRouter);

//user route
v1.use("/user", userRouter);
