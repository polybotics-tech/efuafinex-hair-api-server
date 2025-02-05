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
    DefaultHelper.return_success(
      res,
      201,
      "Package created successfully",
      data
    );
    return;
  },
  fetch_single_package: async (req, res) => {
    const { target_package } = req?.body;

    if (!target_package) {
      DefaultHelper.return_error(res, 400, "Unable to fetch package details");
      return;
    }

    //if meta and packages stored in request body, return data
    let data = target_package;

    //emit event
    PackageEvent.emit("package-fetched", { data });

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
    PackageEvent.emit("package-fetched", { data });

    //
    DefaultHelper.return_success(
      res,
      200,
      "Packages fetched successfully",
      data
    );
    return;
  },
};
