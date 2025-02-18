import e from "express";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { DepositMiddleware } from "../../middlewares/deposit.js";
import { UserMiddleware } from "../../middlewares/user.js";
import { DepositController } from "../../controllers/deposit.js";

export const depositsRouter = e.Router();

//fetch multiple deposits
depositsRouter.get(
  "/",
  AuthMiddleWare.integrate_pagination_query,
  DepositMiddleware.fetch_multiple_deposits,
  DepositController.fetch_multiple_deposits
);

//fetch user deposits
depositsRouter.get(
  "/user/:user_id",
  AuthMiddleWare.integrate_pagination_query,
  UserMiddleware.validate_user_id_params,
  DepositMiddleware.fetch_user_deposits,
  DepositController.fetch_multiple_deposits
);

// fetch single deposit
depositsRouter.get(
  "/:transaction_ref",
  DepositMiddleware.validate_transaction_reference_params,
  DepositController.fetch_single_record
);
