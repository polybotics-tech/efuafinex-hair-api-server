import { db_tables } from "../utils/db_tables.js";
import { DB } from "../hooks/db.js";
import { DefaultHelper } from "../utils/helpers.js";
import { ParamsGenerator } from "../hooks/params.js";

export const UserModel = {
  create_user: async (form) => {
    const sql = `INSERT INTO ${db_tables.users} (created_time, user_id, user_name, fullname, email, phone, pass, auth_token, thumbnail, thumbnail_blur, last_updated, last_seen, push_notify, email_notify, is_verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.user.create_new_user(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_user_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.users} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_user_by_auth_token: async (auth_token) => {
    const sql = `SELECT * FROM ${db_tables.users} WHERE auth_token = ? LIMIT 1`;
    const params = [auth_token];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_user_by_email: async (email) => {
    const sql = `SELECT * FROM ${db_tables.users} WHERE email = ? LIMIT 1`;
    const params = [email];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_user_by_user_id: async (user_id) => {
    const sql = `SELECT * FROM ${db_tables.users} WHERE user_id = ? LIMIT 1`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  update_user_token: async (token, user_id) => {
    const sql = `UPDATE ${db_tables.users} SET last_updated=?, last_seen=?, auth_token=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_auth_token(token, user_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  fetch_otp_by_user_id: async (user_id) => {
    const sql = `SELECT * FROM ${db_tables.otp_verifications} WHERE user_id = ? LIMIT 1`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  create_otp_verification: async (otp, user_id) => {
    const sql = `INSERT INTO ${db_tables.otp_verifications} (created_time, otp, user_id) VALUES (?,?,?)`;
    const params = ParamsGenerator.user.update_otp_verification(otp, user_id);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  update_otp_verification: async (otp, user_id) => {
    const sql = `UPDATE ${db_tables.otp_verifications} SET created_time =?, otp=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_otp_verification(otp, user_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  delete_otp_by_user_id: async (user_id) => {
    const sql = `DELETE FROM ${db_tables.otp_verifications} WHERE user_id = ? LIMIT 1`;
    const params = [user_id];

    const deleted = await DB.delete(sql, params);

    return deleted;
  },
  update_user_pass: async (pass, user_id) => {
    const sql = `UPDATE ${db_tables.users} SET last_updated=?, last_seen=?, pass=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_pass(pass, user_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_user_notify: async (push_notify, email_notify, user_id) => {
    const sql = `UPDATE ${db_tables.users} SET last_updated=?, last_seen=?, push_notify=?, email_notify=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_notify(
      push_notify,
      email_notify,
      user_id
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_user_last_seen: async (user_id) => {
    const sql = `UPDATE ${db_tables.users} SET last_seen=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_last_seen(user_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_user_is_verified: async (user_id) => {
    const sql = `UPDATE ${db_tables.users} SET is_verified=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_is_verified(user_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_user_thumbnail: async (thumbnail, thumbnail_blur, user_id) => {
    const sql = `UPDATE ${db_tables.users} SET last_updated=?, last_seen=?, thumbnail=?, thumbnail_blur=? WHERE user_id=? LIMIT 1`;
    const params = ParamsGenerator.user.update_thumbnail(
      thumbnail,
      thumbnail_blur,
      user_id
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
};
