import e from "express";

export const authRouter = e.Router();

authRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Auth route" });
});
