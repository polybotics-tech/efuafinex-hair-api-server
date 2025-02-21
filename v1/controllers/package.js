import { PackageModel } from "../models/package.js";
import { UserModel } from "../models/user.js";
import { PackageEvent } from "../subscribers/package.js";
import { DefaultHelper } from "../utils/helpers.js";

export const PackageController = {
  create_new_package: async (req, res) => {
    const { item } = req?.body;

    if (!item) {
      DefaultHelper.return_error(res, 400, "Unable to create package");
      return;
    }

    //if item stored in request body, return data
    let data = item;

    //emit event
    PackageEvent.emit("package-created", { data });

    //
    return DefaultHelper.return_success(
      res,
      200,
      "Package created successfully",
      data
    );
  },
  fetch_single_package: async (req, res) => {
    const { target_package } = req?.body;

    if (!target_package) {
      DefaultHelper.return_error(res, 400, "Unable to fetch package details");
      return;
    }

    //fetch package user details for reference
    const user = await UserModel.fetch_user_by_user_id(target_package?.user_id);

    //if meta and packages stored in request body, return data
    let data = { ...target_package, user };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Package fetched successfully",
      data
    );
    return;
  },
  fetch_user_packages: async (req, res) => {
    const { packages, meta } = req?.body;

    if (!packages || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch packages");
      return;
    }

    //if meta and packages stored in request body, return data
    let data = { packages, meta };

    //emit event
    PackageEvent.emit("packages-fetched");

    //
    DefaultHelper.return_success(
      res,
      200,
      "Packages fetched successfully",
      data
    );
    return;
  },
  mark_package_completed: async (req, res) => {
    //extract package
    const { target_package } = req?.body;
    const { package_id } = target_package;

    //update package status
    const update_status = await PackageModel.update_package_status(
      "completed",
      package_id
    );

    if (!update_status) {
      DefaultHelper.return_error(res, 400, "Unable to update package status");
      return;
    }

    DefaultHelper.return_success(res, 200, "Package was successfully closed");
    return;
  },
  fetch_multiple_packages: async (req, res) => {
    const { packages, meta } = req?.body;

    if (!packages || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch app packages");
      return;
    }

    //if meta and packages stored in request body, return data
    let data = { packages, meta };

    //
    DefaultHelper.return_success(
      res,
      200,
      "App packages fetched successfully",
      data
    );
    return;
  },
  admin: {
    update_package_status: async (req, res) => {
      //extract package
      const { target_package, status_choice } = req?.body;
      const { package_id } = target_package;

      //update package status
      const update_status = await PackageModel.update_package_status(
        status_choice,
        package_id
      );

      if (!update_status) {
        DefaultHelper.return_error(res, 400, "Unable to update package status");
        return;
      }

      DefaultHelper.return_success(
        res,
        200,
        `Package was successfully ${status_choice}`
      );
      return;
    },
  },
};
