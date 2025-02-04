import { logbot } from "../../logger.js";

export const DefaultHelper = {
  return_error: (
    res,
    statusCode = 400,
    message = "Something went wrong",
    data = {}
  ) => {
    logbot.Error(`API request error - ${JSON.stringify({ message, data })}`);

    return res
      .status(statusCode)
      .json({
        success: false,
        message,
        data,
      })
      .end();
  },

  return_success: (
    res,
    statusCode = 200,
    message = "Request successful",
    data = {}
  ) => {
    res
      .status(statusCode)
      .json({
        success: true,
        message,
        data,
      })
      .end();
  },

  get_offset: (currentPage) => {
    if (isNaN(currentPage)) {
      currentPage = 1;
    }
    return (currentPage - 1) * config?.pageLimit;
  },

  empty_or_rows: (rows) => {
    if (!rows) {
      return [];
    } else {
      return [...rows];
    }
  },

  check_has_prev_next_page: (page, totalRes, isNext) => {
    const approxPages = Math.round(totalRes / config.pageLimit);

    if (isNext) {
      return page < approxPages ? true : false;
    } else {
      return page > 1 ? true : false;
    }
  },

  hide_user_credentials: (user) => {
    let pass_deleted = delete user["pass"];
    let token_deleted = delete user["auth_token"];
    if (pass_deleted && token_deleted) {
      return user;
    } else {
      user.pass = "";
      user.auth_token = "";
      return user;
    }
  },
};
