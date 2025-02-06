import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const DepositModel = {
  create_new_deposit_record: async (form) => {
    const sql = `INSERT INTO ${db_tables.deposits} (created_time, deposit_id, transaction_ref, package_id, user_id, amount_expected, amount_paid, fee_charged, status, last_updated, authorization_url, extra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = ParamsGenerator.deposit.create_new_deposit_record(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  fetch_deposit_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.deposits} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  fetch_deposit_by_transaction_ref: async (transaction_ref) => {
    const sql = `SELECT * FROM ${db_tables.deposits} WHERE transaction_ref = ? LIMIT 1`;
    const params = [transaction_ref];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data[0].extra = JSON.parse(data[0]?.extra);
    }

    return data.length > 0 ? data[0] : false;
  },
  update_deposit_record_status: async (status, transaction_ref) => {
    const sql = `UPDATE ${db_tables.deposits} SET last_updated=?, status=? WHERE transaction_ref=? LIMIT 1`;
    const params = ParamsGenerator.deposit.update_status(
      status,
      transaction_ref
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_deposit_record_amount_paid: async (amount_paid, transaction_ref) => {
    const sql = `UPDATE ${db_tables.deposits} SET amount_paid=? WHERE transaction_ref=? LIMIT 1`;
    const params = ParamsGenerator.deposit.update_amount_paid(
      amount_paid,
      transaction_ref
    );

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  update_deposit_record_extra: async (extra, transaction_ref) => {
    const sql = `UPDATE ${db_tables.deposits} SET extra=? WHERE transaction_ref=? LIMIT 1`;
    const params = ParamsGenerator.deposit.update_extra(extra, transaction_ref);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  fetch_event_pending_deposits: async () => {
    const sql = `SELECT * FROM ${db_tables.deposits} WHERE status = ? LIMIT 5`;
    const params = ["pending"];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  fetch_user_deposits: async (user_id, page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.deposits} WHERE user_id = ? LIMIT ${offset}, ${config.pageLimit}`;
    const params = [user_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    if (data.length > 0) {
      data.forEach((d) => {
        d.extra = JSON.parse(d?.extra);
      });
    }

    return data;
  },
  count_all_user_deposits: async (user_id) => {
    const sql = `SELECT COUNT(*) FROM ${db_tables.deposits} WHERE user_id = ?`;
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
