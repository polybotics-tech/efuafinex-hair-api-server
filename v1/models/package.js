import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const PackageModel = {
  create_package: async (form) => {
    const sql = `INSERT INTO ${db_tables.packages} (created_time, package_id, user_id, title, description, package_type, target_amount, available_amount, auto_complete, fixed_deadline, deadline, has_photo, photo, photo_blur, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.package.create_new_package(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_package_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.packages} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_package_by_package_id: async (package_id) => {
    const sql = `SELECT * FROM ${db_tables.packages} WHERE package_id = ? LIMIT 1`;
    const params = [package_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_user_packages: async (user_id, page = 1, sort = "all", q = "") => {
    const offset = DefaultHelper.get_offset(page);

    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = [
      "in-progress",
      "completed",
      "on-delivery",
      "delivered",
      "canceled",
    ];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(package_id LIKE '%${q}%' || title LIKE '%${q}%' || description LIKE '%${q}%') `;

    const sql = `SELECT * FROM ${db_tables.packages} WHERE ${filter}${query}&& user_id = ? ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_user_packages: async (user_id, sort = "all", q = "") => {
    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = [
      "in-progress",
      "completed",
      "on-delivery",
      "delivered",
      "canceled",
    ];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(package_id LIKE '%${q}%' || title LIKE '%${q}%' || description LIKE '%${q}%') `;

    const sql = `SELECT COUNT(*) FROM ${db_tables.packages} WHERE ${filter}${query}&& user_id = ?`;
    const params = [user_id];

    const res = await DB.read(sql, params);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
  update_package_available_amount: async (available_amount, package_id) => {
    const sql = `UPDATE ${db_tables.packages} SET available_amount=? WHERE package_id=? LIMIT 1`;
    const params = ParamsGenerator.package.update_available_amount(
      available_amount,
      package_id
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_package_status: async (status, package_id) => {
    const sql = `UPDATE ${db_tables.packages} SET status=? WHERE package_id=? LIMIT 1`;
    const params = ParamsGenerator.package.update_status(status, package_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  fetch_multiple_packages: async (q = "", page = 1, sort = "all") => {
    const offset = DefaultHelper.get_offset(page);

    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = [
      "in-progress",
      "completed",
      "on-delivery",
      "delivered",
      "canceled",
    ];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(package_id LIKE '%${q}%' || title LIKE '%${q}%' || description LIKE '%${q}%') `;

    const sql = `SELECT * FROM ${db_tables.packages} WHERE ${filter}${query}ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_multiple_packages: async (q = "", sort = "all") => {
    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = [
      "in-progress",
      "completed",
      "on-delivery",
      "delivered",
      "canceled",
    ];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(package_id LIKE '%${q}%' || title LIKE '%${q}%' || description LIKE '%${q}%')`;

    const sql = `SELECT COUNT(*) FROM ${db_tables.packages} WHERE ${filter}${query}`;

    const res = await DB.read(sql);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
};
