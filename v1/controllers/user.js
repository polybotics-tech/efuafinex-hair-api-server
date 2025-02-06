import { UserEvent } from "../subscribers/user.js";
import { DefaultHelper } from "../utils/helpers.js";

export const UserController = {
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
};
