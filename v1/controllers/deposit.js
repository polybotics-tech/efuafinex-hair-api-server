import { DepositEvent } from "../subscribers/deposit.js";
import { TransferEvent } from "../subscribers/transfer.js";
import { DefaultHelper } from "../utils/helpers.js";

export const DepositController = {
  make_deposit: async (req, res) => {
    const { deposit } = req?.body;

    if (!deposit) {
      DefaultHelper.return_error(
        res,
        400,
        "Connection error. Please try again later"
      );
      return;
    }

    //if deposit stored in request body, return data
    const { transaction_ref, authorization_url, amount_expected, fee_charged } =
      deposit;

    let data = {
      transaction_ref,
      authorization_url,
      amount_expected,
      fee_charged,
    };

    //
    DefaultHelper.return_success(
      res,
      201,
      "Deposit requested successfully",
      data
    );
    return;
  },
  handle_success_page: async (req, res) => {
    const { reference, deposit_record } = req?.body;

    res.status(200).json({
      success: true,
      message: "Deposit was successful",
      data: deposit_record,
    });

    //call deposit-made event
    let data = { reference, deposit_record };
    DepositEvent.emit("deposit-made", { data });

    //call event to update any pending deposit on records
    DepositEvent.emit("update-pending-deposits");
  },
  fetch_single_record: async (req, res) => {
    const { deposit_record } = req?.body;

    if (!deposit_record) {
      DefaultHelper.return_error(res, 400, "Unable to fetch deposit record");
      return;
    }

    //if deposit_record stored in request body, return data
    let data = deposit_record;

    //call event to update any pending deposit on records
    DepositEvent.emit("update-pending-deposits");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Deposit record fetched successfully",
      data
    );
    return;
  },
  fetch_multiple_deposits: async (req, res) => {
    const { deposits, meta } = req?.body;

    if (!deposits || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch deposits");
      return;
    }

    //if meta and deposits stored in request body, return data
    let data = { deposits, meta };

    //emit event
    DepositEvent.emit("update-pending-deposits");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Deposits fetched successfully",
      data
    );
    return;
  },
  fetch_total_transactions: async (req, res) => {
    const { total_deposits, total_cashouts } = req?.body;

    //if total_deposits stored in request body, return data
    let data = { total_deposits, total_cashouts };

    //emit event
    DepositEvent.emit("update-pending-deposits");
    //call event to update any pending transfer on records
    TransferEvent.emit("update-pending-transfers");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Total transactions fetched successfully",
      data
    );
    return;
  },
};
