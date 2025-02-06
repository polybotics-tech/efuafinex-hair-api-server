import crypto from "crypto";
import { config } from "../../config.js";
import { DepositEvent } from "../subscribers/deposit.js";
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

    //call event to update any pending deposit on records
    DepositEvent.emit("update-pending-deposits");

    //
    DefaultHelper.return_success(
      res,
      201,
      "Deposit requested successfully",
      data
    );
    return;
  },
  handle_webhook: async (req, res) => {
    const hash = crypto
      .createHmac("sha512", config.paystack.secretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      // retrieve the request's body
      const event = req.body;

      console.log("event: ", event);
      if (event.event === "charge.success") {
        console.log("Payment Successful:", event.data);
        // update your database here
      }

      res.sendStatus(200);
    }
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
};
