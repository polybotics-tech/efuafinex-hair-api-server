import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const TransferModel = {
  create_new_transfer_record: async (form) => {
    const sql = `INSERT INTO ${db_tables.transfers} (created_time, transfer_id, transaction_ref, transfer_code, package_id, admin_id, amount, fee_charged, status, last_updated, reason, recipient_code, extra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.transfer.create_new_transfer_record(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  update_transfer_record_status: async (status, transaction_ref) => {
    const sql = `UPDATE ${db_tables.transfers} SET last_updated=?, status=? WHERE transaction_ref=? LIMIT 1`;
    const params = ParamsGenerator.transfer.update_status(
      status,
      transaction_ref
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_transfer_record_transfer_code: async (
    transfer_code,
    transaction_ref
  ) => {
    const sql = `UPDATE ${db_tables.transfers} SET last_updated=?, transfer_code=? WHERE transaction_ref=? LIMIT 1`;
    const params = ParamsGenerator.transfer.update_transfer_code(
      transfer_code,
      transaction_ref
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  fetch_transfer_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.transfers} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  fetch_transfer_by_package_id: async (package_id) => {
    const sql = `SELECT * FROM ${db_tables.transfers} WHERE package_id = ? LIMIT 1`;
    const params = [package_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  fetch_transfer_by_transaction_ref: async (transaction_ref) => {
    const sql = `SELECT * FROM ${db_tables.transfers} WHERE transaction_ref = ? LIMIT 1`;
    const params = [transaction_ref];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  fetch_transfer_by_transfer_code: async (transfer_code) => {
    const sql = `SELECT * FROM ${db_tables.transfers} WHERE transfer_code = ? LIMIT 1`;
    const params = [transfer_code];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  fetch_event_pending_transfers: async () => {
    const sql = `SELECT * FROM ${db_tables.transfers} WHERE (status != 'success' || status != 'failed') LIMIT 5`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  fetch_multiple_transfers: async (q = "", page = 1, sort = "all") => {
    const offset = DefaultHelper.get_offset(page);

    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = ["pending", "failed", "success"];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(transfer_id LIKE '%${q}%' || transfer_code LIKE '%${q}%' || transaction_ref LIKE '%${q}%' || package_id LIKE '%${q}%') `;

    const sql = `SELECT * FROM ${db_tables.transfers} WHERE ${filter}${query}ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data.forEach((d) => {
        d.extra = JSON.parse(d?.extra);
      });
    }

    return data;
  },
  count_all_multiple_transfers: async (q = "", sort = "all") => {
    //filter query by sort parameter passed by user
    sort = String(sort)?.trim()?.toLowerCase();
    let filter = "";
    let allowedSorts = ["pending", "failed", "success"];
    if (sort != "all" && allowedSorts?.includes(sort)) {
      filter = `status = '${sort}' && `;
    }

    let query = `(transfer_id LIKE '%${q}%' || transfer_code LIKE '%${q}%' || transaction_ref LIKE '%${q}%' || package_id LIKE '%${q}%')`;

    const sql = `SELECT COUNT(*) FROM ${db_tables.transfers} WHERE ${filter}${query}`;

    const res = await DB.read(sql);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
  sum_transfers_by_year: async (year) => {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const sql = `SELECT SUM(amount) AS total_transfers FROM ${db_tables.transfers} WHERE status = 'success' && (created_time >= '${yearStart}' && created_time <= '${yearEnd}')`;

    const res = await DB.read(sql);

    if (res?.length > 0 && res[0]?.hasOwnProperty("total_transfers")) {
      const sum = res[0]["total_transfers"];
      return Number(sum || 0);
    } else {
      return 0;
    }
  },
};
