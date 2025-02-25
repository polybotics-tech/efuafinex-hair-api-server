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
    req.body.package_id = package_id;
    req.body.target_package = target_package;

    next();
  },
  validate_package_ownership: async (req, res, next) => {
    const { user_id, target_package } = req?.body;

    if (user_id != target_package?.user_id) {
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Permission not granted"
      );
      return;
    }

    next();
  },
  fetch_user_packages: async (req, res, next) => {
    try {
      const { user, page, sort, q } = req?.body;
      const { user_id } = user;

      //fetch packages by user_id
      const packages = await PackageModel.fetch_user_packages(
        user_id,
        page,
        sort,
        q
      );

      //meta data
      const tup = await PackageModel.count_all_user_packages(user_id, sort, q);
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
  fetch_multiple_packages: async (req, res, next) => {
    try {
      const { q, page, sort } = req?.body;

      //fetch packages by q and page
      const packages = await PackageModel.fetch_multiple_packages(
        q,
        page,
        sort
      );

      //meta data
      const tup = await PackageModel.count_all_multiple_packages(q, sort);
      const meta = {
        q,
        page,
        sort,
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
  validate_package_status_params: async (req, res, next) => {
    //grab the package id
    const { status } = req?.params;
    const { target_package } = req?.body;

    let status_choice = String(status)?.trim()?.toLowerCase();

    const allowed_statuses = ["delivered", "canceled"];
    const preceeding_status = "on-delivery";
    const package_current_status = target_package?.status;

    if (!allowed_statuses?.includes(status_choice)) {
      DefaultHelper.return_error(
        res,
        403,
        "Access denied. Unknown status submitted"
      );
      return;
    }

    if (String(package_current_status)?.toLowerCase() != preceeding_status) {
      DefaultHelper.return_error(res, 400, "Unable to update package status");
      return;
    }

    //append to body request
    req.body.status_choice = status_choice;

    next();
  },
};
