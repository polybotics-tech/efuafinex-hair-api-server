import { AuthSchema } from "../models/schema/auth.js";
import { DepositSchema } from "../models/schema/deposit.js";
import { FaqsSchema } from "../models/schema/faqs.js";
import { PackageSchema } from "../models/schema/package.js";
import { TransferSchema } from "../models/schema/transfer.js";
import { UserSchema } from "../models/schema/user.js";

const validator = (schema) => (payload) => schema.validate(payload);

export const FormValidator = {
  login: validator(AuthSchema.login),
  register: validator(AuthSchema.register),
  forgot_pass: validator(AuthSchema.forgot_pass),
  reset_pass: validator(AuthSchema.reset_pass),
  otp_verification: validator(AuthSchema.otp_verification),
  update_account: validator(UserSchema.update_account),
  update_pass: validator(UserSchema.update_pass),
  update_notify: validator(UserSchema.update_notify),
  create_package: validator(PackageSchema.create_package),
  make_deposit: validator(DepositSchema.make_deposit),

  admin: {
    login: validator(AuthSchema.admin.login),
    register: validator(AuthSchema.admin.register),
    reset_passcode: validator(AuthSchema.admin.reset_passcode),
    otp_verification: validator(AuthSchema.admin.otp_verification),
    update_account: validator(UserSchema.admin.update_account),
    update_pass: validator(UserSchema.admin.update_pass),
    create_faqs: validator(FaqsSchema.create_faqs),
    create_contact_info: validator(FaqsSchema.create_contact_info),
    send_bulk_mail: validator(FaqsSchema.send_bulk_mail),
    verify_transfer_account: validator(TransferSchema.verify_transfer_account),
    request_transfer: validator(TransferSchema.request_transfer),
    finalize_transfer: validator(TransferSchema.finalize_transfer),
  },
};
