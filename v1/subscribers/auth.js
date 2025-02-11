import EventEmitter from "events";
import { UserModel } from "../models/user.js";
import { MailSender } from "../hooks/mailer.js";
export const AuthEvent = new EventEmitter();

//--auth event listeners
AuthEvent.on("register", async (args) => {
  const { data } = args;
  const { user } = data;

  //send welcome email to user
  await MailSender.registration_success(user);
});

AuthEvent.on("otp-generated", async (args) => {
  const { data } = args;
  const { user, otp } = data;

  //send email to user with otp
  await MailSender.otp_generated(user, otp);
});

AuthEvent.on("otp-verified", async (args) => {
  const { data } = args;
  const { user } = data;
  const { user_id } = user;

  //delete otp record for user
  await UserModel.delete_otp_by_user_id(user_id);

  //send success email to user
  await MailSender.otp_verified(user);
});
