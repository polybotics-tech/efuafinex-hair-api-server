import e from "express";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { PackageMiddleware } from "../middlewares/package.js";
import { PackageController } from "../controllers/package.js";

export const packageRouter = e.Router();

//create new package
packageRouter.post(
  "/",
  PackageMiddleware.validate_create_package_form,
  AuthMiddleWare.validate_token_authorization,
  PackageMiddleware.create_package,
  PackageController.create_new_package
);

// fetch user packages
packageRouter.get(
  "/",
  AuthMiddleWare.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  PackageMiddleware.fetch_user_packages,
  PackageController.fetch_user_packages
);

// fetch single package
packageRouter.get(
  "/:package_id",
  PackageMiddleware.validate_package_id_params,
  AuthMiddleWare.validate_token_authorization,
  PackageController.fetch_single_package
);
