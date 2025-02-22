import { config } from "../../config.js";
import { DB } from "../hooks/db.js";
import { ParamsGenerator } from "../hooks/params.js";
import { db_tables } from "../utils/db_tables.js";
import { DefaultHelper } from "../utils/helpers.js";

export const FaqsModel = {
  create_faq: async (form) => {
    const sql = `INSERT INTO ${db_tables.faqs} (created_time, faq_id, question, answer, tags) VALUES (?,?,?,?,?)`;
    const params = ParamsGenerator.faq.create_new_faq(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  update_faq: async (form, faq_id) => {
    const sql = `UPDATE ${db_tables.faqs} set question=?, answer=?, tags=? WHERE faq_id=? LIMIT 1`;
    const params = ParamsGenerator.faq.update_faq(form, faq_id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  fetch_faq_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.faqs} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_faq_by_faq_id: async (faq_id) => {
    const sql = `SELECT * FROM ${db_tables.faqs} WHERE faq_id = ? LIMIT 1`;
    const params = [faq_id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_faqs: async (page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.faqs} ORDER BY id DESC LIMIT ${offset}, ${config.pageLimit}`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    return data;
  },
  count_all_faqs: async () => {
    const sql = `SELECT COUNT(*) FROM ${db_tables.faqs}`;

    const res = await DB.read(sql);

    if (res?.length > 0 && res[0]?.hasOwnProperty("COUNT(*)")) {
      const count = res[0]["COUNT(*)"];
      return count;
    } else {
      return 0;
    }
  },
  fetch_contact_info: async () => {
    const sql = `SELECT * FROM ${db_tables.contact_info} LIMIT 1`;

    const rows = await DB.read(sql);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_contact_info_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.contact_info} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  create_contact_info: async (form) => {
    const sql = `INSERT INTO ${db_tables.contact_info} (email, instagram, whatsapp) VALUES (?,?,?)`;
    const params = ParamsGenerator.faq.create_contact_info(form);

    //attempt save to db
    const saved = await DB.save(sql, params);
    if (!saved) {
      return false;
    }

    return saved;
  },
  update_contact_info: async (form, id) => {
    const sql = `UPDATE ${db_tables.contact_info} set email=?, instagram=?, whatsapp=? WHERE id=? LIMIT 1`;
    const params = ParamsGenerator.faq.update_contact_info(form, id);

    //attempt to update db
    const attempt_to_update = await DB.update(sql, params);
    return attempt_to_update;
  },
  delete_faq_by_faq_id: async (faq_id) => {
    const sql = `DELETE FROM ${db_tables.faqs} WHERE faq_id = ? LIMIT 1`;
    const params = [faq_id];

    const deleted = await DB.delete(sql, params);

    return deleted;
  },
};
