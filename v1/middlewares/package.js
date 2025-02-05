import { PackageModel } from "../models/package.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";

export const PackageMiddleware = {
  validate_create_package_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.create_package(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  create_package: async (req, res, next) => {
    try {
      //create new package
      const new_package = await PackageModel.create_package(req?.body);

      if (!new_package) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      //fetch new package details
      const item = await PackageModel.fetch_package_by_id(new_package);

      if (!item) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      req.body.item = item;
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
  validate_package_id_params: async (req, res, next) => {
    //grab the package id
    const { package_id } = req?.params;

    //fetch target package
    const target_package = await PackageModel.fetch_package_by_package_id(
      package_id
    );

    if (!target_package) {
      DefaultHelper.return_error(res, 404, "Package not found");
      return;
    }

    //append to body request
    req.body.target_package = target_package;

    next();
  },
  fetch_user_packages: async (req, res, next) => {
    try {
      const { user, page } = req?.body;
      const { user_id } = user;

      //fetch packages by user_id
      const packages = await PackageModel.fetch_user_packages(user_id, page);

      //meta data
      const tup = await PackageModel.count_all_user_packages(user_id);
      const meta = {
        user_id,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.packages = packages;
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
};
