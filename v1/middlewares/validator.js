import { AuthSchema } from "../models/schema/auth.js";
import { UserSchema } from "../models/schema/user.js";

const validator = (schema) => (payload) => schema.validate(payload);

export const FormValidator = {
  login: validator(AuthSchema.login),
  register: validator(AuthSchema.register),
  update_pass: validator(UserSchema.update_pass),
};
