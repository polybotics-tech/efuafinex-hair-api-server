import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";
import { config } from "../../config.js";
import { FileManagerUtility } from "../utils/file_manager.js";
import { AdminModel } from "../models/admin.js";

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
  fetch_multiple_users: async (req, res, next) => {
    try {
      const { q, page, sort } = req?.body;

      //fetch users by q and page
      const raw_users = await UserModel.fetch_multiple_users(q, page, sort);

      //meta data
      const tus = await UserModel.count_all_multiple_users(q, sort);
      const meta = {
        q,
        page,
        total_results: parseInt(tus),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tus, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tus, false),
      };

      const users = [];

      raw_users?.forEach((user) => {
        users.push(DefaultHelper.hide_user_credentials(user));
      });

      //append to body request
      req.body.users = users;
      req.body.meta = meta;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  validate_user_id_params: async (req, res, next) => {
    //grab the user id
    const { user_id } = req?.params;

    //fetch target user
    const user = await UserModel.fetch_user_by_user_id(user_id);

    if (!user) {
      DefaultHelper.return_error(res, 404, "User not found");
      return;
    }

    //append to body request
    req.body.user = user;

    next();
  },
  admin: {
    hash_new_passcode: async (req, res, next) => {
      const { new_passcode } = req?.body;
      //hash password
      const hashed = bcrypt.hashSync(
        new_passcode,
        Number(config.bcryptHashSalt)
      );
      if (hashed) {
        req.body.new_passcode = String(hashed);
        next();
      } else {
        DefaultHelper.return_error(res, 400, "Unable to process request");
        return;
      }
    },
    store_new_passcode: async (req, res, next) => {
      const { new_passcode, admin_id } = req?.body;
      //
      const pass_updated = AdminModel.update_admin_passcode(
        new_passcode,
        admin_id
      );

      if (!pass_updated) {
        DefaultHelper.return_error(res, 400, "Error updating account passcode");
        return;
      }

      //done updating password
      next();
    },
  },
};
