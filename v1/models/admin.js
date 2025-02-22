import { db_tables } from "../utils/db_tables.js";
import { DB } from "../hooks/db.js";
import { DefaultHelper } from "../utils/helpers.js";
import { ParamsGenerator } from "../hooks/params.js";
import { config } from "../../config.js";

export const AdminModel = {
  create_admin: async (form) => {
    const sql = `INSERT INTO ${db_tables.admins} (created_time, admin_id, admin_name, fullname, email, phone, passcode, auth_token, is_verified) VALUES (?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.admin.create_new_admin(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_admin_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.admins} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_admin_by_auth_token: async (auth_token) => {
    const sql = `SELECT * FROM ${db_tables.admins} WHERE auth_token = ? LIMIT 1`;
    const params = [auth_token];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_admin_by_email: async (email) => {
    const sql = `SELECT * FROM ${db_tables.admins} WHERE email = ? LIMIT 1`;
    const params = [email];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_admin_by_admin_id: async (admin_id) => {
    const sql = `SELECT * FROM ${db_tables.admins} WHERE admin_id = ? LIMIT 1`;
    const params = [admin_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  update_admin_token: async (token, admin_id) => {
    const sql = `UPDATE ${db_tables.admins} SET auth_token=? WHERE admin_id=? LIMIT 1`;
    const params = ParamsGenerator.admin.update_auth_token(token, admin_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_admin_data: async (email, fullname, phone, admin_id) => {
    const sql = `UPDATE ${db_tables.admins} SET email=?, fullname=?, phone=? WHERE admin_id=? LIMIT 1`;
    const params = ParamsGenerator.admin.update_data(
      email,
      fullname,
      phone,
      admin_id
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_admin_passcode: async (passcode, admin_id) => {
    const sql = `UPDATE ${db_tables.admins} SET passcode=? WHERE admin_id=? LIMIT 1`;
    const params = ParamsGenerator.admin.update_passcode(passcode, admin_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_admin_is_verified: async (admin_id) => {
    const sql = `UPDATE ${db_tables.admins} SET is_verified=? WHERE admin_id=? LIMIT 1`;
    const params = ParamsGenerator.admin.update_is_verified(admin_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
};
