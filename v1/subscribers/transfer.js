import EventEmitter from "events";
import { API_REQUESTS } from "../hooks/api/requests.js";
import { TransferModel } from "../models/transfer.js";
import { PackageModel } from "../models/package.js";

export const TransferEvent = new EventEmitter();

//--transfer event listeners
TransferEvent.on("update-status", async (args) => {
  // extract transaction reference
  const { data } = args;
  const { reference, transfer_record } = data;

  //send request to paystack to verify transaction
  const verify_response = await API_REQUESTS.Paystack.verify_transfer(
    reference
  );

  if (verify_response) {
    //extract needed data
    const { status } = verify_response;

    if (transfer_record?.status != status) {
      //update transfer status on db
      await TransferModel.update_transfer_record_status(status, reference);
    }

    //update package status
    const { package_id } = transfer_record;
    await PackageModel.update_package_status("on-delivery", package_id);
  }

  /*if (verify_response) {
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
  }*/
});

TransferEvent.on("update-pending-transfers", async () => {
  //fetch latest 5 pending transfers
  const pending_transfers = await TransferModel.fetch_event_pending_transfers();

  if (pending_transfers?.length > 0) {
    //verify and update status from paystack by calling the transfer-made event
    pending_transfers?.forEach((transfer_record) => {
      let data = {
        reference: transfer_record?.transaction_ref,
        transfer_record,
      };

      TransferEvent.emit("update-status", { data });
    });
  }
});

TransferEvent.on("transfer-made", async (args) => {
  // extract transaction reference
  const { data } = args;
  const { reference, transfer_record } = data;

  //send request to paystack to verify transaction
  const verify_response = await API_REQUESTS.Paystack.verify_transfer(
    reference
  );

  if (verify_response) {
    //extract needed data
    const { status } = verify_response;

    if (transfer_record?.status != status) {
      //update transfer status on db
      await TransferModel.update_transfer_record_status(status, reference);
    }

    //update package status
    const { package_id } = transfer_record;
    await PackageModel.update_package_status("on-delivery", package_id);
  }
});
