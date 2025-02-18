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
  PackageMiddleware.fetch_multiple_packages,
  PackageController.fetch_multiple_packages
);

//fetch user packages
packagesRouter.get(
  "/user/:user_id",
  AuthMiddleWare.integrate_pagination_query,
  UserMiddleware.validate_user_id_params,
  PackageMiddleware.fetch_user_packages,
  PackageController.fetch_user_packages
);

// fetch single package
packagesRouter.get(
  "/:package_id",
  PackageMiddleware.validate_package_id_params,
  PackageController.fetch_single_package
);
