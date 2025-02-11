import { DefaultHelper } from "../utils/helpers.js";

export const NotificationController = {
  fetch_notifications: async (req, res) => {
    const { notifications, meta } = req?.body;

    if (!notifications || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch notifications");
      return;
    }

    //if meta and notifications stored in request body, return data
    let data = { notifications, meta };

    //
    DefaultHelper.return_success(
      res,
      200,
      "Notifications fetched successfully",
      data
    );
    return;
  },
};
