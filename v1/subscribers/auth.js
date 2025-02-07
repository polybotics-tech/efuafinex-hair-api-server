import EventEmitter from "events";
import { UserModel } from "../models/user.js";
export const AuthEvent = new EventEmitter();

//--auth event listeners
AuthEvent.on("register", async (args) => {
  console.log("event register: ", args);
  // do stuff
});
