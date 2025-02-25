import crypto from "crypto";
import { config } from "../../config.js";
import { DepositEvent } from "../subscribers/deposit.js";
import { DepositModel } from "../models/deposit.js";
import { TransferModel } from "../models/transfer.js";
import { TransferEvent } from "../subscribers/transfer.js";

export const WebhookController = {
  handle_from_paystack: async (req, res) => {
    const hash = crypto
      .createHmac("sha512", config.paystack.secretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      // retrieve the request's body
      const event = req.body;

      //handle successful deposits
      if (event.event === "charge.success") {
        // update your database here
        const reference = event.data?.reference;

        //fetch deposit record
        const deposit_record =
          await DepositModel.fetch_deposit_by_transaction_ref(reference);

        if (deposit_record?.transaction_ref === reference) {
          let data = { reference, deposit_record };

          DepositEvent.emit("deposit-made", { data });
        }
      }

      //handle successful transfers
      if (event.event === "transfer.success") {
        // update your database here
        const reference = event.data?.reference;

        //fetch transfer record
        const transfer_record =
          await TransferModel.fetch_transfer_by_transaction_ref(reference);

        if (transfer_record?.transaction_ref === reference) {
          let data = { reference, transfer_record };

          TransferEvent.emit("transfer-made", { data });
        }
      }

      res.sendStatus(200);
    }
  },
};
