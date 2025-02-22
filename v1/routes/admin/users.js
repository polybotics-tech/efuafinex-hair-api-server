import e from "express";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { UserMiddleware } from "../../middlewares/user.js";
import { UserController } from "../../controllers/user.js";
import { NotificationMiddleware } from "../../middlewares/notifications.js";
import { NotificationController } from "../../controllers/notifications.js";

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

//fetch user notifications
usersRouter.get(
  "/notifications",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  NotificationMiddleware.fetch_admin_notifications,
  NotificationController.fetch_notifications
);
