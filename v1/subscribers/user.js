import EventEmitter from "events";
import { MailSender } from "../hooks/mailer.js";
export const UserEvent = new EventEmitter();

//--user event listeners
UserEvent.on("password-changed", async (args) => {
  const { data } = args;
  const { user } = data;

  //send confirmation email to user
  if (Boolean(user?.email_notify)) {
    await MailSender.password_changed(user);
  }
});

UserEvent.on("send-bulk-mails", async (args) => {
  const { data } = args;
  const { recipients, subject, body } = data;

  //send confirmation email to user
  if (Boolean(recipients?.length > 0)) {
    await MailSender.bulk_mail_to_users(recipients, subject, body);
  }
});
