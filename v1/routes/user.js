import e from "express";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { UserMiddleware } from "../middlewares/user.js";
import { UserController } from "../controllers/user.js";
import { UploadMiddleWare } from "../middlewares/upload.js";

export const userRouter = e.Router();

userRouter.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "User route" });
});

//update user password
userRouter.put(
  "/pass",
  UserMiddleware.validate_update_pass_form,
  AuthMiddleWare.validate_token_authorization,
  AuthMiddleWare.compare_pass_match,
  UserMiddleware.hash_new_pass,
  UserMiddleware.store_new_user_pass,
  AuthMiddleWare.generate_and_update_token,
  UserController.update_pass
);

//update user notification prefences
userRouter.put(
  "/notify",
  UserMiddleware.validate_update_notify_form,
  AuthMiddleWare.validate_token_authorization,
  UserMiddleware.store_user_notify_preference,
  UserController.update_notify
);

//update user thumbnail
userRouter.put(
  "/thumbnail",
  UploadMiddleWare.upload_single_image,
  AuthMiddleWare.validate_token_authorization,
  UploadMiddleWare.validate_single_image_uploaded,
  UserMiddleware.store_new_user_thumbnail,
  UserController.update_thumbnail
);
