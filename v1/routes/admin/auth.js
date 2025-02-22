import e from "express";
import { AuthController } from "../../controllers/auth.js";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { UserMiddleware } from "../../middlewares/user.js";
import { UserController } from "../../controllers/user.js";

export const authRouter = e.Router();

authRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Admin auth route" });
});

//login
authRouter.post(
  "/login",
  AuthMiddleWare.admin.validate_login_form,
  AuthMiddleWare.admin.find_admin_by_email,
  AuthMiddleWare.admin.compare_passcode_match,
  AuthMiddleWare.admin.generate_and_update_token,
  AuthController.admin.login
);

//register
authRouter.post(
  "/register",
  AuthMiddleWare.admin.validate_register_form,
  AuthMiddleWare.admin.check_email_is_new,
  AuthMiddleWare.admin.hash_new_passcode,
  AuthMiddleWare.admin.create_and_store_admin,
  AuthMiddleWare.admin.generate_and_update_token,
  AuthController.admin.register
);

//revalidate token
authRouter.get(
  "/revalidate",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthController.admin.revalidate
);

//forgot password
authRouter.post(
  "/forgot",
  AuthMiddleWare.validate_forgot_form,
  AuthMiddleWare.admin.find_admin_by_email,
  AuthController.admin.forgot_passcode
);

//reset user password
authRouter.put(
  "/reset",
  AuthMiddleWare.admin.validate_reset_passcode_form,
  AuthMiddleWare.admin.validate_token_authorization,
  UserMiddleware.admin.hash_new_passcode,
  UserMiddleware.admin.store_new_passcode,
  AuthMiddleWare.admin.generate_and_update_token,
  AuthController.admin.reset_pass
);

//generate otp
authRouter.post(
  "/verify",
  AuthMiddleWare.admin.find_admin_by_admin_id,
  AuthMiddleWare.admin.generate_and_update_otp,
  AuthController.admin.generate_otp
);

//verify otp
authRouter.post(
  "/otp",
  AuthMiddleWare.admin.validate_otp_form,
  AuthMiddleWare.admin.find_admin_by_admin_id,
  AuthMiddleWare.admin.validate_admin_otp,
  AuthMiddleWare.admin.generate_and_update_token,
  AuthController.admin.verify_otp
);

//update user account
authRouter.put(
  "/account",
  UserMiddleware.admin.validate_update_account_form,
  AuthMiddleWare.admin.validate_token_authorization,
  UserMiddleware.admin.store_updated_admin_data,
  UserController.admin.update_account
);

//update user password
authRouter.put(
  "/pass",
  UserMiddleware.admin.validate_update_pass_form,
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.admin.compare_passcode_match,
  UserMiddleware.admin.hash_new_passcode,
  UserMiddleware.admin.store_new_admin_passcode,
  AuthMiddleWare.admin.generate_and_update_token,
  UserController.admin.update_pass
);
