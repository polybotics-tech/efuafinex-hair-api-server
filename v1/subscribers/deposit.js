import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { logbot } from "../../logger.js";
import { API_REQUESTS } from "../hooks/api/requests.js";
import { DepositModel } from "../models/deposit.js";
import { PackageEvent } from "./package.js";
import { FormatDateTime } from "../utils/datetime.js";

export const DepositEvent = new EventEmitter();

//--deposit event listeners
DepositEvent.on("update-status", async (args) => {
  // extract transaction reference
  const { data } = args;
  const { reference, deposit_record } = data;
  const { fee_charged, created_time } = deposit_record;

  //send request to paystack to verify transaction
  const verify_response = await API_REQUESTS.Paystack.verify_transaction(
    reference
  );

  if (verify_response) {
    //extract needed data
    const { status, amount, authorization } = verify_response;
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

        //update deposit record extra
        let extra;

        if (String(authorization?.channel)?.toLowerCase() === "card") {
          const { channel, bin, last4, exp_month, exp_year, card_type } =
            authorization;

          extra = {
            channel,
            bin,
            last4,
            exp_month,
            exp_year,
            card_type,
          };
        } else if (
          String(authorization?.channel)?.toLowerCase() === "bank_transfer"
        ) {
          const {
            channel,
            sender_bank,
            sender_name,
            sender_bank_account_number,
          } = authorization;

          extra = {
            channel,
            sender_bank,
            sender_name,
            sender_bank_account_number,
          };
        }

        await DepositModel.update_deposit_record_extra(extra, reference);
      }
    }
  } else {
    //check if created_time is more than 5hours
    if (FormatDateTime.verify_is_more_than_hours(created_time, 5)) {
      //update deposit status on db
      await DepositModel.update_deposit_record_status("failed", reference);
    }
  }
});

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
    const { status, amount, authorization } = verify_response;
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
              transaction_ref: reference,
            },
          });
        }

        //update deposit record extra
        let extra;

        if (String(authorization?.channel)?.toLowerCase() === "card") {
          const { channel, bin, last4, exp_month, exp_year, card_type } =
            authorization;

          extra = {
            channel,
            bin,
            last4,
            exp_month,
            exp_year,
            card_type,
          };
        } else if (String(channel)?.toLowerCase() === "bank_transfer") {
          const {
            channel,
            sender_bank,
            sender_name,
            sender_bank_account_number,
          } = authorization;

          extra = {
            channel,
            sender_bank,
            sender_name,
            sender_bank_account_number,
          };
        }

        await DepositModel.update_deposit_record_extra(extra, reference);
      }
    }
  }
});

DepositEvent.on("update-pending-deposits", async () => {
  //fetch latest 5 pending deposits
  const pending_deposits = await DepositModel.fetch_event_pending_deposits();

  if (pending_deposits?.length > 0) {
    //verify and update status from paystack by calling the deposit-made event
    pending_deposits?.forEach((deposit_record) => {
      let data = {
        reference: deposit_record?.transaction_ref,
        deposit_record,
      };

      DepositEvent.emit("update-status", { data });
    });
  }
});

DepositEvent.on("deposits-fetched", async () => {
  //call event to update any pending deposit on records
  DepositEvent.emit("update-pending-deposits");
});
