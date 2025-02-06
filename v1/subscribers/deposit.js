import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { logbot } from "../../logger.js";
import { API_REQUESTS } from "../hooks/api/requests.js";
import { DepositModel } from "../models/deposit.js";
import { PackageEvent } from "./package.js";

export const DepositEvent = new EventEmitter();

//--package event listeners
DepositEvent.on("deposit-made", async (args) => {
  // extract transaction reference
  const { data } = args;
  const { reference, deposit_record } = data;
  const { fee_charged } = deposit_record;

  //send request to paystack to verify transaction
  const verify_response = await API_REQUESTS.Paystack.verify_transaction(
    reference
  );

  if (verify_response) {
    //extract needed data
    const { status, amount, channel, authorization } = verify_response;
    const paid_amount = parseInt(Number(amount / 100) - Number(fee_charged));

    if (deposit_record?.status != status) {
      //update deposit status on db
      await DepositModel.update_deposit_record_status(status, reference);

      if (status === "success" && deposit_record?.amount_paid != paid_amount) {
        //update deposit record amount paid on db
        const update_amount =
          await DepositModel.update_deposit_record_amount_paid(
            paid_amount,
            reference
          );

        if (update_amount) {
          //emit event to add amount paid to package available amount
          PackageEvent.emit("fund-added-to-package", {
            data: {
              amount: paid_amount,
              package_id: deposit_record?.package_id,
            },
          });
        }

        if (channel === "bank_transfer") {
          //update deposit record extra
          const {
            sender_bank,
            sender_name,
            sender_bank_account_number,
            narration,
          } = authorization;
          const extra = {
            sender_bank,
            sender_name,
            sender_bank_account_number,
            narration,
          };

          await DepositModel.update_deposit_record_extra(extra, reference);
        }
      }
    }
  }
});
