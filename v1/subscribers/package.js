import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { PackageModel } from "../models/package.js";
import { DepositEvent } from "./deposit.js";
import { NotificationModel } from "../models/notifications.js";
import { MailSender } from "../hooks/mailer.js";

export const PackageEvent = new EventEmitter();

//--package event listeners
PackageEvent.on("package-created", async (args) => {
  const { data } = args;
  const { package_id, user_id } = data;

  //create in app notification
  const form = {
    actor_id: user_id,
    notification_type: "package-created",
    target_id: user_id,
    package_id,
  };

  await NotificationModel.create_notification(form);
});

PackageEvent.on("packages-fetched", async () => {
  //call event to update any pending deposit on records
  DepositEvent.emit("update-pending-deposits");
});

PackageEvent.on("fund-added-to-package", async (args) => {
  // extract package_id, and amount to add
  const { data } = args;
  const { amount, package_id, transaction_ref } = data;

  //fetch package by package_id
  const target_package = await PackageModel.fetch_package_by_package_id(
    package_id
  );

  if (target_package) {
    const { available_amount, target_amount, auto_complete, user_id, title } =
      target_package;

    //do the maths
    const new_amount = Number(available_amount + amount);

    //update package available amount
    await PackageModel.update_package_available_amount(new_amount, package_id);

    //check if auto_complete is true, then status to completed on complete
    if (auto_complete) {
      //check difference in target amount and new amount
      let balance = Number(target_amount - new_amount);

      if (Number(balance) < 100) {
        //no other deposit can be made
        const update_status = await PackageModel.update_package_status(
          "completed",
          package_id
        );

        if (update_status) {
          //send status update notifications to owner and admin
        }
      }
    }

    //create in app notification
    const form = {
      actor_id: user_id,
      notification_type: "fund-added-to-package",
      target_id: user_id,
      package_id,
      amount,
      transaction_ref,
    };

    await NotificationModel.create_notification(form);

    //send notifications to package owner
    const user = await UserModel.fetch_user_by_user_id(user_id);
    if (user) {
      //send notice email to user
      await MailSender.package_funded(
        user,
        amount,
        package_id,
        transaction_ref,
        title
      );
    }
  }
});
