import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const PackageModel = {
  create_package: async (form) => {
    const sql = `INSERT INTO ${db_tables.packages} (created_time, package_id, user_id, title, description, package_type, target_amount, available_amount, auto_complete, fixed_deadline, deadline, duration, has_photo, photo, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.package.create_new_package(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_user_packages: async (user_id, page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.packages} WHERE user_id = ? LIMIT ${offset}, ${config.pageLimit}`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_user_packages: async (user_id) => {
    const sql = `SELECT COUNT(*) FROM ${db_tables.packages} WHERE user_id = ?`;
    const params = [user_id];

    const res = await DB.read(sql, params);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
};
