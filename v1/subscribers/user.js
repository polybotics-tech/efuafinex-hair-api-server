import EventEmitter from "events";
export const UserEvent = new EventEmitter();

//--user event listeners
UserEvent.on("password-changed", async (data) => {
  console.log("event change password: ", data);
  // do stuff
});
