import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";
import { config } from "../../config.js";
import { FileManagerUtility } from "../utils/file_manager.js";

export const UserMiddleware = {
  validate_update_account_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.update_account(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
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
  validate_update_notify_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.update_notify(form);

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
  store_updated_user_data: async (req, res, next) => {
    const { fullname, phone, user_id } = req?.body;
    //
    const account_updated = UserModel.update_user_data(
      fullname,
      phone,
      user_id
    );

    if (!account_updated) {
      DefaultHelper.return_error(res, 400, "Error updating account details");
      return;
    }

    //fetch updated user
    const updatedUser = await UserModel.fetch_user_by_user_id(user_id);

    req.body.user = updatedUser;
    //done updating account
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
  store_user_notify_preference: async (req, res, next) => {
    const { push_notify, email_notify, user_id } = req?.body;

    //store notify preference in db
    const update_notify = await UserModel.update_user_notify(
      push_notify,
      email_notify,
      user_id
    );

    if (!update_notify) {
      DefaultHelper.return_error(
        res,
        400,
        "Unable to update notification preference"
      );
      return;
    }

    //fetch new user
    const user = await UserModel.fetch_user_by_user_id(user_id);

    req.body.user = user;
    next();
  },
  store_new_user_thumbnail: async (req, res, next) => {
    try {
      const { user_id, user, upload_url, upload_blur } = req?.body;
      const { thumbnail } = user;

      //attempt to update user thumbnail
      const updated = await UserModel.update_user_thumbnail(
        upload_url,
        upload_blur,
        user_id
      );

      if (!updated) {
        return DefaultHelper.return_error(
          res,
          500,
          "Error updating profile thumbnail"
        );
      }

      //if updated, attempt to delete former thumbnail if any
      if (thumbnail) {
        await FileManagerUtility.delete_uploaded_asset(thumbnail);
      }

      //fetch the updated user
      let updated_user = await UserModel.fetch_user_by_user_id(user_id);

      //refresh
      req.body.user = updated_user;
      next();
    } catch (error) {
      return DefaultHelper.return_error(
        res,
        500,
        error?.message || "Error updating profile thumbnail"
      );
    }
  },
  update_user_last_seen: async (req, res, next) => {
    const { user } = req?.body;
    const { user_id } = user;

    // update user last seen
    if (user_id) {
      await UserModel.update_user_last_seen(user_id);
    }

    next();
  },
};
