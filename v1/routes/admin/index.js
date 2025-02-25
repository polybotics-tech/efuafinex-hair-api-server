import e from "express";
import { faqsRouter } from "./faqs.js";
import { usersRouter } from "./users.js";
import { packagesRouter } from "./packages.js";
import { depositsRouter } from "./deposits.js";
import { authRouter } from "./auth.js";
import { transfersRouter } from "./transfers.js";

export const adminRouter = e.Router();

adminRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Admin route" });
});

//auth routes
adminRouter.use("/auth", authRouter);

//faqs routes
adminRouter.use("/faqs", faqsRouter);

//users routes
adminRouter.use("/users", usersRouter);

//packages routes
adminRouter.use("/packages", packagesRouter);

//deposits routes
adminRouter.use("/deposits", depositsRouter);

//transfers routes
adminRouter.use("/transfers", transfersRouter);
