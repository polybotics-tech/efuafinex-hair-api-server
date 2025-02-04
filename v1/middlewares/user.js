import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";
import { config } from "../../config.js";

export const UserMiddleware = {
  validate_update_pass_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.update_pass(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  hash_new_pass: async (req, res, next) => {
    const { new_pass } = req?.body;
    //hash password
    const hashed = bcrypt.hashSync(new_pass, Number(config.bcryptHashSalt));
    if (hashed) {
      req.body.new_pass = String(hashed);
      next();
    } else {
      DefaultHelper.return_error(res, 400, "Unable to process request");
      return;
    }
  },
  find_user_by_user_id: async (req, res, next) => {
    let { user_id } = req?.body;

    //check if user_id exist for user
    const userFound = await UserModel.fetch_user_by_user_id(user_id);

    if (!userFound) {
      DefaultHelper.return_error(res, 404, "Access denied. User not found", {
        user_id,
      });
      return;
    }

    req.body.user = userFound;
    next();
  },
  store_new_user_pass: async (req, res, next) => {
    const { new_pass, user_id } = req?.body;
    //
    const pass_updated = UserModel.update_user_pass(new_pass, user_id);

    if (!pass_updated) {
      DefaultHelper.return_error(res, 400, "Error updating account password");
      return;
    }

    //done updating password
    next();
  },
};
