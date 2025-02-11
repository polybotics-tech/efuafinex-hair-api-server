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
      let thumbnail_blur = "";
      let push_notify = Boolean(true);
      let email_notify = Boolean(true);
      let is_verified = Boolean(false);

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
        thumbnail_blur,
        last_updated,
        last_seen,
        push_notify,
        email_notify,
        is_verified,
      ];
    },
    update_otp_verification: (otp, user_id) => {
      let created_time = FormatDateTime.to_database_entry();
      otp = Number(otp);

      return [created_time, otp, user_id];
    },
    update_data: (fullname, phone, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      fullname = String(fullname);
      phone = String(phone);

      return [last_updated, last_seen, fullname, phone, user_id];
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
    update_is_verified: (user_id) => {
      let is_verified = Boolean(true);

      return [is_verified, user_id];
    },
    update_thumbnail: (thumbnail, thumbnail_blur, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      thumbnail = String(thumbnail);
      thumbnail_blur = String(thumbnail_blur);

      return [last_updated, last_seen, thumbnail, thumbnail_blur, user_id];
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
      title = String(title)?.toLowerCase();
      description = String(description);
      is_defined = Boolean(is_defined);
      let package_type = is_defined ? "defined" : "free";
      target_amount = is_defined ? Number(target_amount || 1000) : 0;
      let available_amount = Number(0);
      auto_complete = is_defined ? Boolean(auto_complete === "true") : false;
      fixed_deadline = Boolean(fixed_deadline === "true");
      duration = !duration ? 0 : Number(duration?.split("month")[0]);
      deadline = fixed_deadline
        ? FormatDateTime.to_database_entry(deadline)
        : FormatDateTime.to_database_entry(
            FormatDateTime.to_future_deadline_from_duration(duration)
          );
      has_photo = is_defined ? Boolean(has_photo === "true") : false;
      let photo = has_photo ? form?.upload_url : "";
      let photo_blur = has_photo ? form?.upload_blur : "";
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
        photo_blur,
        status,
      ];
    },
    update_available_amount: (available_amount, package_id) => {
      available_amount = Number(available_amount);

      return [available_amount, package_id];
    },
    update_status: (status, package_id) => {
      status = String(status);

      return [status, package_id];
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
        fee_charged,
      } = form;

      let created_time = FormatDateTime.to_database_entry();
      let deposit_id = IdGenerator.deposit_id;
      amount_expected = Number(amount_expected);
      let amount_paid = Number(0);
      fee_charged = Number(fee_charged);
      let status = "pending";
      let last_updated = FormatDateTime.to_database_entry();
      authorization_url = String(authorization_url);
      let extra = JSON.stringify({
        channel: "",
      });

      return [
        created_time,
        deposit_id,
        transaction_ref,
        package_id,
        user_id,
        amount_expected,
        amount_paid,
        fee_charged,
        status,
        last_updated,
        authorization_url,
        extra,
      ];
    },
    update_status: (status, transaction_ref) => {
      let last_updated = FormatDateTime.to_database_entry();
      status =
        String(status)?.toLowerCase() === "success" ||
        String(status)?.toLowerCase() === "pending"
          ? String(status)?.toLowerCase()
          : "failed";

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
  faq: {
    create_new_faq: (form) => {
      let { question, answer, tags } = form;

      let created_time = FormatDateTime.to_database_entry();
      let faq_id = IdGenerator.faq_id;
      question = String(question)?.toLowerCase();
      answer = String(answer)?.toLowerCase();
      tags = String(tags)?.toLowerCase();

      return [created_time, faq_id, question, answer, tags];
    },
  },
  notification: {
    create_new_notification: (form) => {
      let { actor_id, notification_type, target_id } = form;

      let created_time = FormatDateTime.to_database_entry();
      let notification_id = IdGenerator.notification_id;
      actor_id = String(actor_id)?.toLowerCase();
      notification_type = String(notification_type)?.toLowerCase();
      target_id = String(target_id)?.toLowerCase();
      let extra;

      switch (notification_type) {
        case "package-created":
          extra = {
            package_id: form?.package_id,
          };
          break;
        case "fund-added-to-package":
          extra = {
            package_id: form?.package_id,
            transaction_ref: form?.transaction_ref,
            amount: form?.amount,
          };
          break;

        default:
          extra = {};
          break;
      }

      extra = JSON.stringify(extra);

      return [
        created_time,
        notification_id,
        actor_id,
        notification_type,
        target_id,
        extra,
      ];
    },
  },
};
