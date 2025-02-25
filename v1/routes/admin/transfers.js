import e from "express";
import { TransferMiddleware } from "../../middlewares/transfer.js";
import { AuthMiddleWare } from "../../middlewares/auth.js";
import { TransferController } from "../../controllers/transfer.js";
import { PackageMiddleware } from "../../middlewares/package.js";

export const transfersRouter = e.Router();

//fetch multiple transfers
transfersRouter.get(
  "/",
  AuthMiddleWare.admin.validate_token_authorization,
  AuthMiddleWare.integrate_pagination_query,
  TransferMiddleware.fetch_multiple_transfers,
  TransferController.fetch_multiple_transfers
);

//verify transfer account
transfersRouter.post(
  "/verify/account",
  TransferMiddleware.validate_verify_account_form,
  AuthMiddleWare.admin.validate_token_authorization,
  TransferMiddleware.verify_transfer_account_with_paystack,
  TransferMiddleware.create_transfer_recipient_with_paystack,
  TransferController.verify_transfer_account
);

//request fund transfer to account
transfersRouter.post(
  "/request/funds/:package_id",
  TransferMiddleware.validate_request_transfer_form,
  AuthMiddleWare.admin.validate_token_authorization,
  PackageMiddleware.validate_package_id_params,
  TransferMiddleware.confirm_paystack_balance_can_cover_amount,
  TransferMiddleware.create_transfer_record_on_db,
  TransferMiddleware.initiate_transfer_with_paystack,
  TransferController.request_fund_transfer
);

//validate otp to finalize transfer
transfersRouter.post(
  "/finalize/:transfer_code",
  TransferMiddleware.validate_finalize_transfer_form,
  AuthMiddleWare.admin.validate_token_authorization,
  TransferMiddleware.validate_transfer_code_params,
  TransferMiddleware.finalize_transfer_with_paystack,
  TransferController.fetch_single_record
);

//resend otp for transfer validation
transfersRouter.get(
  "/otp/:transfer_code",
  AuthMiddleWare.admin.validate_token_authorization,
  TransferMiddleware.validate_transfer_code_params,
  TransferMiddleware.resend_otp_from_paystack,
  TransferController.resend_transfer_otp
);

//verify transfer with paystack
transfersRouter.get(
  "/verify/:package_id",
  PackageMiddleware.validate_package_id_params,
  AuthMiddleWare.admin.validate_token_authorization,
  TransferMiddleware.fetch_transfer_record_by_package_id,
  TransferMiddleware.verify_transaction_ref_with_paystack,
  TransferController.fetch_single_record
);

//fetch package transfer record details
transfersRouter.get(
  "/:package_id",
  PackageMiddleware.validate_package_id_params,
  AuthMiddleWare.admin.validate_token_authorization,
  TransferMiddleware.fetch_transfer_record_by_package_id,
  TransferController.fetch_single_record
);
