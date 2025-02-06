import e from "express";
import { PackageMiddleware } from "../middlewares/package.js";
import { DepositMiddleware } from "../middlewares/deposit.js";
import { AuthMiddleWare } from "../middlewares/auth.js";
import { DepositController } from "../controllers/deposit.js";

export const depositRouter = e.Router();

//fetch multiple deposit records for user
depositRouter.get(
  "/",
  AuthMiddleWare.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  DepositMiddleware.fetch_user_deposits,
  DepositController.fetch_multiple_deposits
);

//fetch multiple deposit records for a package
depositRouter.get(
  "/records/:package_id",
  AuthMiddleWare.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  PackageMiddleware.validate_package_id_params,
  PackageMiddleware.validate_package_ownership,
  DepositMiddleware.fetch_package_deposits,
  DepositController.fetch_multiple_deposits
);

//test deposit success page
depositRouter.get(
  "/success",
  DepositMiddleware.validate_transaction_reference_query,
  DepositController.handle_success_page
);

//webhook to recieve deposits from paystack
depositRouter.post("/paystack/webhook", DepositController.handle_webhook);

//deposit fund for a package
depositRouter.post(
  "/:package_id",
  DepositMiddleware.validate_make_deposit_form,
  AuthMiddleWare.validate_token_authorization,
  PackageMiddleware.validate_package_id_params,
  PackageMiddleware.validate_package_ownership,
  DepositMiddleware.confirm_amount_within_range,
  DepositMiddleware.initialize_transaction_with_paystack,
  DepositController.make_deposit
);

//fetch deposit record details
depositRouter.get(
  "/:transaction_ref",
  DepositMiddleware.validate_transaction_reference_params,
  AuthMiddleWare.validate_token_authorization,
  DepositMiddleware.validate_deposit_ownership,
  DepositController.fetch_single_record
);
