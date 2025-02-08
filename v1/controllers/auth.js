import { AuthEvent } from "../subscribers/auth.js";
import { UserEvent } from "../subscribers/user.js";
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
  revalidate: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(res, 404, "User not found");
      return;
    }

    //if token stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user) };

    //
    DefaultHelper.return_success(res, 200, "User token validated", data);
    return;
  },
  forgot_pass: async (req, res) => {
    const { user } = req?.body;

    if (!user) {
      DefaultHelper.return_error(res, 400, "No account found for email");
      return;
    }

    //if user stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user) };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Email verification in progress",
      data
    );
    return;
  },
  reset_pass: async (req, res) => {
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
  generate_otp: async (req, res) => {
    const { user, otp } = req?.body;

    if (!user || !otp) {
      DefaultHelper.return_error(res, 400, "Unable to generate otp for user");
      return;
    }

    //if user stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user), otp };

    //emit event
    AuthEvent.emit("otp-generated", { data });

    //
    DefaultHelper.return_success(
      res,
      200,
      "One-Time-Password generated for user",
      data
    );
    return;
  },
  verify_otp: async (req, res) => {
    const { user, token } = req?.body;

    if (!user || !token) {
      DefaultHelper.return_error(res, 400, "Unable to update user token");
      return;
    }

    //if user stored in request body, return data
    let data = { user: DefaultHelper.hide_user_credentials(user), token };

    //emit event
    AuthEvent.emit("otp-verified", { data });

    //
    DefaultHelper.return_success(
      res,
      200,
      "Account user was successfully verified",
      data
    );
    return;
  },
};
