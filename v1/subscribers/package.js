import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { logbot } from "../../logger.js";

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
