import { AuthEvent } from "../subscribers/auth.js";
import { DefaultHelper } from "../utils/helpers.js";

export const AuthController = {
  login: async (req, res) => {
    const { user, token } = req?.body;

    if (!user || !token) {
      DefaultHelper.return_error(res, 400, "Unable to update user token");
      return;
    }

    //if token stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user), token };

    //emit event
    AuthEvent.emit("login", { data });

    //
    DefaultHelper.return_success(res, 200, "User logged in successfully", data);
    return;
  },
  register: async (req, res) => {
    const { user, token } = req?.body;

    if (!user || !token) {
      DefaultHelper.return_error(res, 400, "Unable to update user token");
      return;
    }

    //if token stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user), token };

    //emit event
    AuthEvent.emit("register", { data });

    //
    DefaultHelper.return_success(
      res,
      200,
      "User registered successfully",
      data
    );
    return;
  },
};
