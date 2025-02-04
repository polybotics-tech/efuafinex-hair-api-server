import e from "express";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { UserMiddleware } from "../middlewares/user.js";
import { UserController } from "../controllers/user.js";

export const userRouter = e.Router();

userRouter.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "User route" });
});

//update user password
userRouter.put(
  "/pass",
  UserMiddleware.validate_update_pass_form,
  AuthMiddleWare.validate_token_authorization,
  UserMiddleware.find_user_by_user_id,
  AuthMiddleWare.compare_pass_match,
  UserMiddleware.hash_new_pass,
  UserMiddleware.store_new_user_pass,
  AuthMiddleWare.generate_and_update_token,
  UserController.update_pass
);
