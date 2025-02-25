import { AuthEvent } from "../subscribers/auth.js";
import { DepositEvent } from "../subscribers/deposit.js";
import { TransferEvent } from "../subscribers/transfer.js";
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
      "User account was successfully verified",
      data
    );
    return;
  },
  admin: {
    login: async (req, res) => {
      const { admin, token } = req?.body;

      if (!admin || !token) {
        DefaultHelper.return_error(res, 400, "Unable to update admin token");
        return;
      }

      //if token stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), token };

      //
      DefaultHelper.return_success(
        res,
        200,
        "Admin logged in successfully",
        data
      );
      return;
    },
    register: async (req, res) => {
      const { admin, token } = req?.body;

      if (!admin || !token) {
        DefaultHelper.return_error(res, 400, "Unable to update admin token");
        return;
      }

      //if token stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), token };

      //
      DefaultHelper.return_success(
        res,
        200,
        "Admin registered successfully",
        data
      );
      return;
    },
    revalidate: async (req, res) => {
      const { admin } = req?.body;

      if (!admin) {
        DefaultHelper.return_error(res, 404, "Admin not found");
        return;
      }

      //if token stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin) };

      //call event to update any pending transfer on records
      TransferEvent.emit("update-pending-transfers");
      DepositEvent.emit("update-pending-deposits");

      //
      DefaultHelper.return_success(res, 200, "Admin token validated", data);
      return;
    },
    forgot_passcode: async (req, res) => {
      const { admin } = req?.body;

      if (!admin) {
        DefaultHelper.return_error(
          res,
          400,
          "No admin account found for email"
        );
        return;
      }

      //if admin stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin) };

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
      const { admin, token } = req?.body;

      if (!admin || !token) {
        DefaultHelper.return_error(res, 400, "Unable to update admin token");
        return;
      }

      //if token stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), token };

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
      const { admin, otp } = req?.body;

      if (!admin || !otp) {
        DefaultHelper.return_error(
          res,
          400,
          "Unable to generate otp for admin"
        );
        return;
      }

      //if admin stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), otp };

      //emit event
      AuthEvent.emit("otp-generated", {
        data: { user: DefaultHelper.hide_admin_credentials(admin), otp },
      });

      //
      DefaultHelper.return_success(
        res,
        200,
        "One-Time-Password generated for admin",
        data
      );
      return;
    },
    verify_otp: async (req, res) => {
      const { admin, token } = req?.body;

      if (!admin || !token) {
        DefaultHelper.return_error(res, 400, "Unable to update admin token");
        return;
      }

      //if admin stored in request body, return data
      let data = { admin: DefaultHelper.hide_admin_credentials(admin), token };

      //emit event
      AuthEvent.emit("otp-verified", {
        data: { user: DefaultHelper.hide_admin_credentials(admin), token },
      });

      //
      DefaultHelper.return_success(
        res,
        200,
        "Admin account was successfully verified",
        data
      );
      return;
    },
  },
};
