import { NotificationModel } from "../models/notifications.js";
import { DefaultHelper } from "../utils/helpers.js";

export const NotificationMiddleware = {
  fetch_user_notifications: async (req, res, next) => {
    try {
      const { user, page } = req?.body;
      const { user_id } = user;

      //fetch notifications by user_id
      const notifications = await NotificationModel.fetch_user_notifications(
        user_id,
        page
      );

      //meta data
      const tup = await NotificationModel.count_all_user_notifications(user_id);
      const meta = {
        user_id,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.notifications = notifications;
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
