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
  fetch_faq_by_id: async (id) => {
    const sql = `SELECT * FROM ${db_tables.faqs} WHERE id = ? LIMIT 1`;
    const params = [id];

    const rows = await DB.read(sql, params);

    const data = DefaultHelper.empty_or_rows(rows);

    return data.length > 0 ? data[0] : false;
  },
  fetch_faqs: async (page = 1) => {
    const offset = DefaultHelper.get_offset(page);

    const sql = `SELECT * FROM ${db_tables.faqs} ORDER BY id ASC LIMIT ${offset}, ${config.pageLimit}`;

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
};
