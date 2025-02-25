import { TransferEvent } from "../subscribers/transfer.js";
import { DefaultHelper } from "../utils/helpers.js";

export const TransferController = {
  verify_transfer_account: async (req, res) => {
    const { account_number, bank_code, account_name, recipient_code } =
      req?.body;

    if (!account_name || !recipient_code) {
      DefaultHelper.return_error(
        res,
        400,
        "Connection error. Please try again later"
      );
      return;
    }

    //return data
    let data = { account_number, bank_code, account_name, recipient_code };

    //call event to update any pending transfer on records
    TransferEvent.emit("update-pending-transfers");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Bank account verified successfully",
      data
    );
    return;
  },
  resend_transfer_otp: async (req, res) => {
    const { transfer_code, transfer_record } = req?.body;

    if (!transfer_code || !transfer_record) {
      DefaultHelper.return_error(res, 404, "Transfer record not found");
      return;
    }

    //if transfer_code stored in request body, return data
    let data = { transfer_code };

    //
    DefaultHelper.return_success(
      res,
      200,
      "OTP resent to admin contacts",
      data
    );
    return;
  },
  fetch_single_record: async (req, res) => {
    const { transfer_record } = req?.body;

    if (!transfer_record) {
      DefaultHelper.return_error(res, 400, "Unable to fetch transfer record");
      return;
    }

    //if transfer_record stored in request body, return data
    let data = transfer_record;

    //call event to update any pending transfer on records
    TransferEvent.emit("update-pending-transfers");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Transfer record fetched successfully",
      data
    );
    return;
  },
  fetch_multiple_transfers: async (req, res) => {
    const { transfers, meta } = req?.body;

    if (!transfers || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch transfers");
      return;
    }

    //if meta and transfers stored in request body, return data
    let data = { transfers, meta };

    //emit event
    TransferEvent.emit("update-pending-transfers");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Transfers fetched successfully",
      data
    );
    return;
  },
  request_fund_transfer: async (req, res) => {
    const { transfer_record } = req?.body;
    const { status, transfer_code } = transfer_record;

    if (!status || !transfer_code) {
      DefaultHelper.return_error(
        res,
        400,
        "Connection error. Please try again later"
      );
      return;
    }

    //if status and transfer_code stored in request body, return data
    let data = { status, transfer_code };

    //call event to update any pending transfer on records
    TransferEvent.emit("update-pending-transfers");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Request has been submitted. Validation required",
      data
    );
    return;
  },
};
