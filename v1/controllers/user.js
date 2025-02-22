import { UserEvent } from "../subscribers/user.js";
import { DefaultHelper } from "../utils/helpers.js";

export const UserController = {
  update_account: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(res, 400, "Unable to update account details");
      return;
    }

    //if user stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user) };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Account details updated successfully",
      data
    );
    return;
  },
  update_pass: async (req, res) => {
    const { user, token } = req?.body;

    if (!user || !token) {
      DefaultHelper.return_error(res, 400, "Unable to update user token");
      return;
    }

    //if token stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user), token };

    //emit event
    UserEvent.emit("password-changed", { data });

    //
    DefaultHelper.return_success(
      res,
      200,
      "Account password updated successfully",
      data
    );
    return;
  },
  update_notify: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(
        res,
        400,
        "Unable to update notification preference"
      );
      return;
    }

    //if token stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user) };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Notification preference updated successfully",
      data
    );
    return;
  },
  update_thumbnail: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(
        res,
        400,
        "Unable to update profile thumbnail"
      );
      return;
    }

    //if user stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user) };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Profile thumbnail updated successfully",
      data
    );
    return;
  },
  fetch_multiple_users: async (req, res) => {
    const { users, meta } = req?.body;

    if (!users || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch app users");
      return;
    }

    //if meta and users stored in request body, return data
    let data = { users, meta };

    //
    DefaultHelper.return_success(
      res,
      200,
      "App users fetched successfully",
      data
    );
    return;
  },
  fetch_single_user: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(res, 400, "Unable to fetch user details");
      return;
    }

    //if meta and users stored in request body, return data
    let data = DefaultHelper.hide_user_credentials(user);

    //
    DefaultHelper.return_success(
      res,
      200,
      "User details fetched successfully",
      data
    );
    return;
  },
  admin: {
    update_account: async (req, res) => {
      const { admin } = req?.body;

      if (!admin) {
        DefaultHelper.return_error(
          res,
          400,
          "Unable to update account details"
        );
        return;
      }

      //if admin stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin) };

      //
      DefaultHelper.return_success(
        res,
        200,
        "Account details updated successfully",
        data
      );
      return;
    },
    update_pass: async (req, res) => {
      const { admin, token } = req?.body;

      if (!admin || !token) {
        DefaultHelper.return_error(res, 400, "Unable to update admin token");
        return;
      }

      //if token stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), token };

      //emit event
      UserEvent.emit("password-changed", {
        data: { user: DefaultHelper.hide_admin_credentials(admin) },
      });

      //
      DefaultHelper.return_success(
        res,
        200,
        "Account password updated successfully",
        data
      );
      return;
    },
  },
};
