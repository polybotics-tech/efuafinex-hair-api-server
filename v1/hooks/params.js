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
      ];
    },
    update_pass: (pass, user_id) => {
      let last_updated = FormatDateTime.to_database_entry();
      let last_seen = FormatDateTime.to_database_entry();
      pass = `${pass}`;

      return [last_updated, last_seen, pass, user_id];
    },
  },
};
