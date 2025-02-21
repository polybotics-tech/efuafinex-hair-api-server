import e from "express";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { DepositMiddleware } from "../../middlewares/deposit.js";
import { UserMiddleware } from "../../middlewares/user.js";
import { DepositController } from "../../controllers/deposit.js";
import { PackageMiddleware } from "../../middlewares/package.js";

export const depositsRouter = e.Router();

//fetch multiple deposits
depositsRouter.get(
  "/",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  DepositMiddleware.fetch_multiple_deposits,
  DepositController.fetch_multiple_deposits
);

//fetch deposit sum (total amount paid by users)
depositsRouter.get(
  "/total",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  DepositMiddleware.fetch_total_transactions,
  DepositController.fetch_total_transactions
);

//fetch user deposits
depositsRouter.get(
  "/user/:user_id",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  UserMiddleware.validate_user_id_params,
  DepositMiddleware.fetch_user_deposits,
  DepositController.fetch_multiple_deposits
);

//fetch package deposits
depositsRouter.get(
  "/records/:package_id",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  PackageMiddleware.validate_package_id_params,
  DepositMiddleware.fetch_package_deposits,
  DepositController.fetch_multiple_deposits
);

// fetch single deposit
depositsRouter.get(
  "/:transaction_ref",
  AuthMiddleWare.admin.validate_token_authorization,
  DepositMiddleware.validate_transaction_reference_params,
  DepositController.fetch_single_record
);
