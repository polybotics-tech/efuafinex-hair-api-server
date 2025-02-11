import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const NotificationModel = {
  create_notification: async (form) => {
    const sql = `INSERT INTO ${db_tables.notifications} (created_time, notification_id, actor_id, notification_type, target_id, extra) VALUES (?,?,?,?,?,?)`;
    const params = ParamsGenerator.notification.create_new_notification(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_user_notifications: async (user_id, page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.notifications} WHERE target_id = ? ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_user_notifications: async (user_id) => {
    const sql = `SELECT COUNT(*) FROM ${db_tables.notifications} WHERE target_id = ?`;
    const params = [user_id];

    const res = await DB.read(sql, params);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
  fetch_notifications: async (page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.notifications} ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_notifications: async () => {
    const sql = `SELECT COUNT(*) FROM ${db_tables.notifications}`;

    const res = await DB.read(sql);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
};
