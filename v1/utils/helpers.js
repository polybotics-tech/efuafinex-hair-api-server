import path from "path";
import { config } from "../../config.js";
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
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
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

  check_has_prev_next_page: (page = 1, totalRes, isNext) => {
    const approxPages = Number(totalRes / config?.pageLimit);

    if (isNext) {
      return parseInt(page) < approxPages ? true : false;
    } else {
      return parseInt(page) > 1 ? true : false;
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
  hide_admin_credentials: (admin) => {
    let pass_deleted = delete admin["passcode"];
    let token_deleted = delete admin["auth_token"];
    if (pass_deleted && token_deleted) {
      return admin;
    } else {
      admin.passcode = "";
      admin.auth_token = "";
      return admin;
    }
  },
  calculate_fee_charge_from_amount: (amount) => {
    let wave = Boolean(Number(amount) < 2000); //whether to wave extra charge
    let fee;

    if (wave) {
      if (amount < 1000) {
        fee = parseInt(Number(amount * 0.015) + 5);
      } else {
        fee = parseInt(Number(amount * 0.015) + 20);
      }
    } else {
      if (amount < 10000) {
        fee = parseInt(Number(amount * 0.015) + 150);
      } else {
        fee = parseInt(Number(amount * 0.015) + 250);
      }
    }

    let final = fee < 3000 ? fee : 3000;
    return final;
  },
  calculate_transfer_fee_charge_from_amount: (amount) => {
    let wave = Boolean(Number(amount) <= 5000); //whether to wave extra charge
    let fee; //in naira

    if (wave) {
      fee = parseInt(20);
    } else {
      if (amount > 5000 && amount <= 50000) {
        fee = parseInt(30);
      } else {
        fee = parseInt(50);
      }
    }

    return fee;
  },
  check_balance_can_cover_amount: (balance, amount, fee) => {
    let total_expense = Number(amount) + Number(fee);

    if (Number(balance) <= total_expense) {
      return false;
    }

    return true;
  },
  format_size_to_readable: (size) => {
    const size_ext = ["B", "KB", "MB", "GB"];
    const size_divisor = {
      KB: 1024,
      MB: 1048576,
      GB: 1073741824,
    };

    if (Number(size) >= size_divisor["GB"]) {
      return `${parseFloat(size / size_divisor["GB"]).toFixed(2)}${
        size_ext[3]
      }`;
    }

    if (Number(size) >= size_divisor["MB"]) {
      return `${parseFloat(size / size_divisor["MB"]).toFixed(2)}${
        size_ext[2]
      }`;
    }

    if (Number(size) >= size_divisor["KB"]) {
      return `${parseFloat(size / size_divisor["KB"]).toFixed(2)}${
        size_ext[1]
      }`;
    }

    return `${parseInt(size)}${size_ext[0]}`;
  },
  return_new_tmp_path: (user_id, old_name) => {
    return path.join(
      config.fileUpload.imageUploadDir,
      `${user_id}/${old_name}`
    );
  },
  format_recipient_emails: (recipients = []) => {
    let emails = "";

    for (var i = 0; i < recipients?.length; i++) {
      emails += `${recipients[i]}`;

      if (i != recipients?.length - 1) {
        emails += ", ";
      }
    }

    return String(emails)?.toLowerCase();
  },
};
