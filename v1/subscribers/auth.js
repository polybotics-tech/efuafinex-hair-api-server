import EventEmitter from "events";
export const AuthEvent = new EventEmitter();

//--auth event listeners
AuthEvent.on("login", async (data) => {
  console.log("event login: ", data);
  // do stuff
});

AuthEvent.on("register", async (data) => {
  console.log("event register: ", data);
  // do stuff
});
