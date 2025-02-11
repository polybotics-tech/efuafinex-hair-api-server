import e from "express";
import { faqsRouter } from "./faqs.js";

export const adminRouter = e.Router();

adminRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Admin route" });
});

//faqs routes
adminRouter.use("/faqs", faqsRouter);
