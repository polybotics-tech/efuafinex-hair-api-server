import { FormatDateTime } from "../utils/datetime.js";
import { IdGenerator } from "../utils/id_generator.js";

export const ParamsGenerator = {
  user: {
    update_auth_token: (auth_token, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      auth_token = `${auth_token}`;

      return [last_updated, last_seen, auth_token, user_id];
    },
    create_new_user: (form) => {
      let { fullname, email, phone, pass } = form;

      let created_time = FormatDateTime.to_database_entry();
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      let user_id = IdGenerator.user_id;
      fullname = String(fullname)?.toLowerCase();
      email = String(email)?.toLowerCase();
      phone = String(phone);
      pass = String(pass);
      let user_name = IdGenerator.user_name(fullname?.split(" ")[0]);
      let auth_token = "";
      let thumbnail = "";
      let push_notify = Boolean(true);
      let email_notify = Boolean(true);

      return [
        created_time,
        user_id,
        user_name,
        fullname,
        email,
        phone,
        pass,
        auth_token,
        thumbnail,
        last_updated,
        last_seen,
        push_notify,
        email_notify,
      ];
    },
    update_pass: (pass, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      pass = `${pass}`;

      return [last_updated, last_seen, pass, user_id];
    },
    update_notify: (push_notify, email_notify, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      push_notify = Boolean(push_notify);
      email_notify = Boolean(email_notify);

      return [last_updated, last_seen, push_notify, email_notify, user_id];
    },
    update_last_seen: (user_id) => {
      let last_seen = FormatDateTime.to_database_entry();

      return [last_seen, user_id];
    },
  },
  package: {
    create_new_package: (form) => {
      let {
        user_id,
        title,
        description,
        is_defined,
        target_amount,
        auto_complete,
        fixed_deadline,
        deadline,
        duration,
        has_photo,
      } = form;

      let created_time = FormatDateTime.to_database_entry();
      let package_id = IdGenerator.package_id;
      user_id = String(user_id);
      title = String(title);
      description = String(description);
      let package_type = is_defined ? "defined" : "free";
      target_amount = is_defined ? Number(target_amount || 0) : 0;
      let available_amount = Number(0);
      auto_complete = Boolean(auto_complete === "true");
      fixed_deadline = Boolean(fixed_deadline === "true");
      duration = !duration ? 0 : Number(duration?.split("months")[0]);
      deadline = fixed_deadline
        ? FormatDateTime.to_database_entry(deadline)
        : FormatDateTime.to_database_entry(
            FormatDateTime.to_future_deadline_from_duration(duration)
          );
      has_photo = Boolean(has_photo === "true");
      let photo = ""; //recheck this later
      let status = "in-progress";

      return [
        created_time,
        package_id,
        user_id,
        title,
        description,
        package_type,
        target_amount,
        available_amount,
        auto_complete,
        fixed_deadline,
        deadline,
        has_photo,
        photo,
        status,
      ];
    },
    update_available_amount: (available_amount, package_id) => {
      available_amount = Number(available_amount);

      return [available_amount, package_id];
    },
  },
  deposit: {
    create_new_deposit_record: (form) => {
      let {
        user_id,
        package_id,
        transaction_ref,
        amount_expected,
        authorization_url,
        fee_charge,
      } = form;

      let created_time = FormatDateTime.to_database_entry();
      let deposit_id = IdGenerator.deposit_id;
      amount_expected = Number(amount_expected);
      let amount_paid = Number(0);
      fee_charge = Number(fee_charge);
      let status = "pending";
      let last_updated = FormatDateTime.to_database_entry();
      authorization_url = String(authorization_url);
      let extra = JSON.stringify({
        sender_name: "",
        sender_bank_account_number: "",
        sender_bank: "",
      });

      return [
        created_time,
        deposit_id,
        transaction_ref,
        package_id,
        user_id,
        amount_expected,
        amount_paid,
        fee_charge,
        status,
        last_updated,
        authorization_url,
        extra,
      ];
    },
    update_status: (status, transaction_ref) => {
      let last_updated = FormatDateTime.to_database_entry();
      status = status === "success" || "pending" ? String(status) : "failed";

      return [last_updated, status, transaction_ref];
    },
    update_amount_paid: (amount_paid, transaction_ref) => {
      amount_paid = Number(amount_paid);

      return [amount_paid, transaction_ref];
    },
    update_extra: (extra, transaction_ref) => {
      extra = JSON.stringify(extra);

      return [extra, transaction_ref];
    },
  },
};
