import EventEmitter from "events";
export const UserEvent = new EventEmitter();

//--user event listeners
UserEvent.on("change-password", async (data) => {
  console.log("event change password: ", data);
  // do stuff
});
