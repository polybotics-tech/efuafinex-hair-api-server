import EventEmitter from "events";
import { UserModel } from "../models/user.js";
export const AuthEvent = new EventEmitter();

//--auth event listeners
AuthEvent.on("login", async (args) => {
  try {
    //extract user_id from data from args
    const { data } = args;
    const { user } = data;
    const { user_id } = user;

    // update user last seen
    if (user_id) {
      await UserModel.update_user_last_seen(user_id);
    }
  } catch (error) {
    logbot.Error(error?.message);
  }
});

AuthEvent.on("register", async (args) => {
  console.log("event register: ", args);
  // do stuff
});
