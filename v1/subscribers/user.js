import EventEmitter from "events";
import { MailSender } from "../hooks/mailer.js";
export const UserEvent = new EventEmitter();

//--user event listeners
UserEvent.on("password-changed", async (args) => {
  const { data } = args;
  const { user } = data;

  //send confirmation email to user
  await MailSender.password_changed(user);
});
