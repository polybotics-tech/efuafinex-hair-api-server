import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";
import { Tokenizer } from "../hooks/tokenizer.js";
import { config } from "../../config.js";
import { IdGenerator } from "../utils/id_generator.js";
import { FormatDateTime } from "../utils/datetime.js";
import { UploadHelper } from "./upload.js";

export const AuthMiddleWare = {
  validate_login_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.login(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_register_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.register(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_forgot_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.forgot_pass(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_reset_pass_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.reset_pass(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_otp_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.otp_verification(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  check_email_is_new: async (req, res, next) => {
    let { email } = req?.body;

    //check if email exist for user
    const userFound = await UserModel.fetch_user_by_email(email);

    if (userFound) {
      DefaultHelper.return_error(
        res,
        401,
        "An account exists with this email. Try to login",
        { email }
      );
      return;
    }

    //email doesnt exist on record
    next();
  },
  find_user_by_email: async (req, res, next) => {
    let { email } = req?.body;

    //check if email exist for user
    const userFound = await UserModel.fetch_user_by_email(email);

    if (!userFound) {
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Invalid credentials",
        { email }
      );
      return;
    }

    req.body.user = userFound;
    next();
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
  hash_new_pass: async (req, res, next) => {
    const { pass } = req?.body;
    //hash password
    const hashed = bcrypt.hashSync(pass, Number(config.bcryptHashSalt));
    if (hashed) {
      req.body.pass = String(hashed);
      next();
    } else {
      DefaultHelper.return_error(res, 400, "Unable to process request");
      return;
    }
  },
  compare_pass_match: async (req, res, next) => {
    const { user, pass } = req?.body;

    //compare password
    const match = await bcrypt.compare(pass, user?.pass);
    if (!match) {
      //check if user is from_google, and if current user pass is empty
      const { from_google } = user;
      if (!Boolean(from_google) && user?.pass != "") {
        DefaultHelper.return_error(
          res,
          401,
          "Access denied. Invalid credentials"
        );
        return;
      }
    }

    next();
  },
  create_and_store_user: async (req, res, next) => {
    //create new user
    const new_user = await UserModel.create_user(req?.body);

    if (!new_user) {
      DefaultHelper.return_error(res, 500, "Internal server error has occured");
      return;
    }

    //if user created fetch user record
    const user = await UserModel.fetch_user_by_id(new_user);

    if (!user) {
      DefaultHelper.return_error(res, 500, "Internal server error has occured");
      return;
    }

    req.body.user = user;
    next();
  },
  generate_and_update_token: async (req, res, next) => {
    const { user } = req?.body;
    const { user_id } = user;

    if (!user_id) {
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Invalid authentication credentials"
      );
      return;
    }

    //generate new token
    const new_token = Tokenizer.generate_token(user_id);

    if (!new_token) {
      DefaultHelper.return_error(res, 500, "Internal server error has occured");
      return;
    }

    //update token in user records on db
    const token_updated = UserModel.update_user_token(new_token, user_id);

    if (!token_updated) {
      DefaultHelper.return_error(res, 400, "Unable to update user token");
      return;
    }

    req.body.token = new_token;

    next();
  },
  generate_and_update_otp: async (req, res, next) => {
    const { user } = req?.body;
    const { user_id } = user;

    if (!user_id) {
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Invalid authentication credentials"
      );
      return;
    }

    let new_otp;

    //check if otp exists for user
    const otp_exist = await UserModel.fetch_otp_by_user_id(user_id);

    //check if created_time is less than 15
    if (
      otp_exist &&
      !FormatDateTime.is_more_than_mins(otp_exist?.created_time, 15)
    ) {
      new_otp = otp_exist?.otp;
    } else {
      //generate new otp
      new_otp = IdGenerator.otp;
    }

    if (!new_otp) {
      DefaultHelper.return_error(res, 500, "Internal server error has occured");
      return;
    }

    //update otp in records on db
    let otp_updated;
    if (otp_exist) {
      otp_updated = await UserModel.update_otp_verification(new_otp, user_id);
    } else {
      otp_updated = await UserModel.create_otp_verification(new_otp, user_id);
    }

    if (!otp_updated) {
      DefaultHelper.return_error(res, 400, "Unable to generate otp for user");
      return;
    }

    req.body.otp = new_otp;

    next();
  },
  validate_user_otp: async (req, res, next) => {
    const { user_id, otp } = req?.body;

    //check if user_id - otp combo exists
    const otp_exist = await UserModel.fetch_otp_by_user_id(user_id);

    if (!otp_exist) {
      DefaultHelper.return_error(res, 404, "Access denied. User not found");
      return;
    }

    //check if otp still valid
    if (FormatDateTime.is_more_than_mins(otp_exist?.created_time, 15)) {
      DefaultHelper.return_error(
        res,
        401,
        "One-Time-Password is expired. Request a new one"
      );
      return;
    }

    //check if otp match
    if (otp != otp_exist?.otp) {
      DefaultHelper.return_error(
        res,
        401,
        "Invalid One-Time-Password submitted"
      );
      return;
    }

    //update user is_verified
    const is_verified = await UserModel.update_user_is_verified(user_id);

    req.body.user.is_verified = true;
    next();
  },
  validate_token_authorization: async (req, res, next) => {
    let message = "Access denied. Authorization validation failed";
    let umessage = "Access denied. User not found";

    try {
      if (!req.headers || !req.headers.authorization) {
        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //check if header is recognized
      const tokenKey = req.headers?.authorization.split(" ")[0];
      const token = req.headers?.authorization.split(" ")[1];

      if (tokenKey !== config.tokenAuthorizationKey || !token) {
        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //get the user_id from the decoded token
      const decoded_token = Tokenizer.decode_token(token);
      if (!decoded_token || !decoded_token?.user_id) {
        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //take note of decoded user_id
      const decoded_user_id = decoded_token?.user_id;

      //fetch user by token
      const token_user = await UserModel.fetch_user_by_auth_token(token);

      if (!token_user) {
        DefaultHelper.return_error(res, 404, umessage);
        return;
      }

      //compare user ids
      if (decoded_user_id != token_user?.user_id) {
        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //attach user_id and user to request body
      req.body.user_id = decoded_user_id;
      req.body.user = token_user;

      next();
    } catch (error) {
      DefaultHelper.return_error(res, 401, message);
      return;
    }
  },
  integrate_pagination_query: async (req, res, next) => {
    //obtain page from query or assign page 1
    const page =
      req.query?.page && req.query?.page > 0 ? parseInt(req?.query?.page) : 1;
    const sort = req.query?.sort || "";

    //append current page to body request
    req.body.page = page;
    req.body.sort = String(sort)?.toLowerCase();
    next();
  },
  validate_third_party_request: async (req, res, next) => {
    const { email } = req?.body;

    if (!email) {
      DefaultHelper.return_error(
        res,
        400,
        "Email is missing from third party service"
      );
    }

    next();
  },
  authenticate_apple_signin: async (req, res, next) => {
    let form = req?.body;
    const { email } = form;

    //check if email exist for user
    let user = await UserModel.fetch_user_by_email(email);

    if (!user) {
      //create new user
      const new_user = await UserModel.create_user(form);

      if (!new_user) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      //if user created fetch user record
      user = await UserModel.fetch_user_by_id(new_user);

      if (!user) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      //update new user to toggle on 'from_apple'
      await UserModel.update_user_from_apple(user?.user_id);
    }

    req.body.user = user;
    next();
  },
  authenticate_google_signin: async (req, res, next) => {
    try {
      let form = req?.body;
      const { email } = form;

      //check if email exist for user
      let user = await UserModel.fetch_user_by_email(email);

      if (!user) {
        //create new user
        const new_user = await UserModel.create_user(form);

        if (!new_user) {
          DefaultHelper.return_error(
            res,
            500,
            "Internal server error has occured"
          );
          return;
        }

        //if user created fetch user record
        user = await UserModel.fetch_user_by_id(new_user);

        if (!user) {
          DefaultHelper.return_error(
            res,
            500,
            "Internal server error has occured"
          );
          return;
        }

        //update new user to toggle on 'from_google'
        await UserModel.update_user_from_google(user?.user_id);

        //update new user to toggle on 'is_verified'
        await UserModel.update_user_is_verified(user?.user_id);
      }

      //try to update user thumbnail from google photo
      const upload_photo = await UploadHelper.validate_google_photo_remote_url(
        req,
        user?.user_id
      );

      if (upload_photo && req?.body?.upload_url) {
        const { upload_url, upload_blur } = req?.body;

        let thumbnail_updated = await UserModel.update_user_thumbnail(
          upload_url,
          upload_blur,
          user?.user_id
        );

        if (thumbnail_updated) {
          //fetch updated user
          user = await UserModel.fetch_user_by_user_id(user?.user_id);
        }
      }

      req.body.user = user;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error has occured"
      );
      return;
    }
  },
};
