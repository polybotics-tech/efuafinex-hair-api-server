import e from "express";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { PackageMiddleware } from "../../middlewares/package.js";
import { PackageController } from "../../controllers/package.js";
import { UserMiddleware } from "../../middlewares/user.js";

export const packagesRouter = e.Router();

//fetch multiple packages
packagesRouter.get(
  "/",
  AuthMiddleWare.integrate_pagination_query,
  AuthMiddleWare.admin.validate_token_authorization,
  PackageMiddleware.fetch_multiple_packages,
  PackageController.fetch_multiple_packages
);

//fetch user packages
packagesRouter.get(
  "/user/:user_id",
  AuthMiddleWare.integrate_pagination_query,
  AuthMiddleWare.admin.validate_token_authorization,
  UserMiddleware.validate_user_id_params,
  PackageMiddleware.fetch_user_packages,
  PackageController.fetch_user_packages
);

//update package status to either delivered/canceled
packagesRouter.put(
  "/update/:package_id/:status",
  PackageMiddleware.validate_package_id_params,
  PackageMiddleware.validate_package_status_params,
  AuthMiddleWare.admin.validate_token_authorization,
  PackageController.admin.update_package_status
);

// fetch single package
packagesRouter.get(
  "/:package_id",
  AuthMiddleWare.admin.validate_token_authorization,
  PackageMiddleware.validate_package_id_params,
  PackageController.fetch_single_package
);
