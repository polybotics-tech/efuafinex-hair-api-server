import e from "express";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { UserMiddleware } from "../../middlewares/user.js";
import { UserController } from "../../controllers/user.js";

export const usersRouter = e.Router();

//fetch multiple users
usersRouter.get(
  "/",
  AuthMiddleWare.integrate_pagination_query,
  AuthMiddleWare.admin.validate_token_authorization,
  UserMiddleware.fetch_multiple_users,
  UserController.fetch_multiple_users
);

//fetch single user details
usersRouter.get(
  "/:user_id",
  AuthMiddleWare.admin.validate_token_authorization,
  UserMiddleware.validate_user_id_params,
  UserController.fetch_single_user
);
