import e from "express";
import { AuthController } from "../controllers/auth.js";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { UserMiddleware } from "../middlewares/user.js";

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
  UserMiddleware.update_user_last_seen,
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

//revalidate token
authRouter.get(
  "/revalidate",
  AuthMiddleWare.validate_token_authorization,
  UserMiddleware.update_user_last_seen,
  AuthController.revalidate
);

//forgot password
authRouter.post(
  "/forgot",
  AuthMiddleWare.validate_forgot_form,
  AuthMiddleWare.find_user_by_email,
  AuthController.forgot_pass
);

//reset user password
authRouter.put(
  "/reset",
  AuthMiddleWare.validate_reset_pass_form,
  AuthMiddleWare.validate_token_authorization,
  UserMiddleware.hash_new_pass,
  UserMiddleware.store_new_user_pass,
  AuthMiddleWare.generate_and_update_token,
  AuthController.reset_pass
);

//generate otp
authRouter.post(
  "/verify",
  AuthMiddleWare.find_user_by_user_id,
  AuthMiddleWare.generate_and_update_otp,
  AuthController.generate_otp
);

//verify otp
authRouter.post(
  "/otp",
  AuthMiddleWare.validate_otp_form,
  AuthMiddleWare.find_user_by_user_id,
  AuthMiddleWare.validate_user_otp,
  AuthMiddleWare.generate_and_update_token,
  AuthController.verify_otp
);
