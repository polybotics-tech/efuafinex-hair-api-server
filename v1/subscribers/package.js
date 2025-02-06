import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { logbot } from "../../logger.js";
import { PackageModel } from "../models/package.js";
import { DepositEvent } from "./deposit.js";

export const PackageEvent = new EventEmitter();

//--package event listeners
PackageEvent.on("package-created", async (args) => {
  console.log("event create package: ", args);
  // do stuff
});

PackageEvent.on("package-fetched", async (args) => {
  try {
    //extract user_id from data from args
    const { data } = args;
    const { meta } = data;
    const { user_id } = meta;

    // update user last seen
    if (user_id) {
      await UserModel.update_user_last_seen(user_id);
    }
  } catch (error) {
    logbot.Error(error?.message);
  }
});

PackageEvent.on("packages-fetched", async () => {
  //call event to update any pending deposit on records
  DepositEvent.emit("update-pending-deposits");
});

PackageEvent.on("fund-added-to-package", async (args) => {
  // extract package_id, and amount to add
  const { data } = args;
  const { amount, package_id } = data;

  //fetch package by package_id
  const target_package = await PackageModel.fetch_package_by_package_id(
    package_id
  );

  if (target_package) {
    const { available_amount } = target_package;

    //do the maths
    let new_amount = Number(available_amount + amount);

    //update package available amount
    const update_package = await PackageModel.update_package_available_amount(
      new_amount,
      package_id
    );

    //send notifications to package owner
  }
});
