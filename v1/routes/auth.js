import e from "express";
import { AuthController } from "../controllers/auth.js";
import { AuthMiddleWare } from "../middlewares/auth.js";

export const authRouter = e.Router();

authRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Auth route" });
});

//login
authRouter.post(
  "/login",
  AuthMiddleWare.validate_login_form,
  AuthMiddleWare.find_user_by_email,
  AuthMiddleWare.compare_pass_match,
  AuthMiddleWare.generate_and_update_token,
  AuthController.login
);

//register
authRouter.post(
  "/register",
  AuthMiddleWare.validate_register_form,
  AuthMiddleWare.check_email_is_new,
  AuthMiddleWare.hash_new_pass,
  AuthMiddleWare.create_and_store_user,
  AuthMiddleWare.generate_and_update_token,
  AuthController.register
);
