import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";
import { Tokenizer } from "../hooks/tokenizer.js";
import { config } from "../../config.js";
import { FileManagerUtility } from "../utils/file_manager.js";

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
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Invalid credentials"
      );
      return;
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
  validate_token_authorization: async (req, res, next) => {
    let message = "Access denied. Authorization validation failed";
    let umessage = "Access denied. User not found";

    try {
      if (!req.headers || !req.headers.authorization) {
        //check if any file was upload, and delete if any
        if (req?.file || req?.file?.path) {
          await FileManagerUtility.delete_file_by_path(req?.file?.path);
        }

        DefaultHelper.return_error(res, 403, message);
        return;
      }

      //check if header is recognized
      const tokenKey = req.headers?.authorization.split(" ")[0];
      const token = req.headers?.authorization.split(" ")[1];

      if (tokenKey !== config.tokenAuthorizationKey || !token) {
        //check if any file was upload, and delete if any
        if (req?.file || req?.file?.path) {
          await FileManagerUtility.delete_file_by_path(req?.file?.path);
        }

        DefaultHelper.return_error(res, 403, message);
        return;
      }

      //get the user_id from the decoded token
      const decoded_token = Tokenizer.decode_token(token);
      if (!decoded_token || !decoded_token?.user_id) {
        //check if any file was upload, and delete if any
        if (req?.file || req?.file?.path) {
          await FileManagerUtility.delete_file_by_path(req?.file?.path);
        }

        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //take note of decoded user_id
      const decoded_user_id = decoded_token?.user_id;

      //fetch user by token
      const token_user = await UserModel.fetch_user_by_auth_token(token);

      if (!token_user) {
        //check if any file was upload, and delete if any
        if (req?.file || req?.file?.path) {
          await FileManagerUtility.delete_file_by_path(req?.file?.path);
        }

        DefaultHelper.return_error(res, 404, umessage);
        return;
      }

      //compare user ids
      if (decoded_user_id != token_user?.user_id) {
        //check if any file was upload, and delete if any
        if (req?.file || req?.file?.path) {
          await FileManagerUtility.delete_file_by_path(req?.file?.path);
        }

        DefaultHelper.return_error(res, 401, message);
        return;
      }

      //attach user_id and user to request body
      req.body.user_id = decoded_user_id;
      req.body.user = token_user;

      next();
    } catch (error) {
      //check if any file was upload, and delete if any
      if (req?.file || req?.file?.path) {
        await FileManagerUtility.delete_file_by_path(req?.file?.path);
      }

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
};
