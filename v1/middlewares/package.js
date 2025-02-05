import { PackageModel } from "../models/package.js";
import { DefaultHelper } from "../utils/helpers.js";

export const PackageMiddleware = {
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
