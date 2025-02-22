import mysql from "mysql2";
import { config } from "../../config.js";
import { logbot } from "../../logger.js";

const pool = mysql.createPool(config.db).promise();

const throw_db_conn_err = (err, sql) => {
  let meta = {
    query: sql,
    errMsg: err.message,
  };
  logbot.Error(`DB connection error - ${JSON.stringify(meta)}`);

  return false;
};

export const DB = {
  read: async (sql, params) => {
    try {
      if (params) {
        const [rows] = await pool.query(sql, params);

        return rows;
      }

      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      //
      throw_db_conn_err(error, sql);
      return false;
    }
  },

  save: async (sql, params) => {
    try {
      const [result] = await pool.query(sql, params);

      if (result.insertId) {
        return result.insertId;
      } else {
        return false;
      }
    } catch (error) {
      //
      throw_db_conn_err(error, sql);
      return false;
    }
  },

  update: async (sql, params) => {
    try {
      const [result] = await pool.query(sql, params);

      return result.changedRows ? true : false;
    } catch (error) {
      //
      throw_db_conn_err(error, sql);
      return false;
    }
  },

  delete: async (sql, params) => {
    try {
      const [result] = await pool.query(sql, params);

      return result.affectedRows ? true : false;
    } catch (error) {
      //
      throw_db_conn_err(error, sql);
      return false;
    }
  },
};
