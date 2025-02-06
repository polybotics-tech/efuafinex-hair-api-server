import { AuthSchema } from "../models/schema/auth.js";
import { DepositSchema } from "../models/schema/deposit.js";
import { PackageSchema } from "../models/schema/package.js";
import { UserSchema } from "../models/schema/user.js";

const validator = (schema) => (payload) => schema.validate(payload);

export const FormValidator = {
  login: validator(AuthSchema.login),
  register: validator(AuthSchema.register),
  update_pass: validator(UserSchema.update_pass),
  update_notify: validator(UserSchema.update_notify),
  create_package: validator(PackageSchema.create_package),
  make_deposit: validator(DepositSchema.make_deposit),
};
