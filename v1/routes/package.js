import e from "express";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { PackageMiddleware } from "../middlewares/package.js";
import { PackageController } from "../controllers/package.js";

export const packageRouter = e.Router();

// fetch user packages
packageRouter.get(
  "/",
  AuthMiddleWare.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  PackageMiddleware.fetch_user_packages,
  PackageController.fetch_user_packages
);
