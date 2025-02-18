import e from "express";
import { faqsRouter } from "./faqs.js";
import { usersRouter } from "./users.js";
import { packagesRouter } from "./packages.js";
import { depositsRouter } from "./deposits.js";

export const adminRouter = e.Router();

adminRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Admin route" });
});

//faqs routes
adminRouter.use("/faqs", faqsRouter);

//users routes
adminRouter.use("/users", usersRouter);

//packages routes
adminRouter.use("/packages", packagesRouter);

//deposits routes
adminRouter.use("/deposits", depositsRouter);
