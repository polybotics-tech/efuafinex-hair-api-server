import { PackageEvent } from "../subscribers/package.js";
import { DefaultHelper } from "../utils/helpers.js";

export const PackageController = {
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
