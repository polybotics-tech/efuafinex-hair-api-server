import "dotenv/config";

const prefix = process.env.EFH_DB_PREFIX;

export const db_tables = {
  users: `${prefix}users`,
  packages: `${prefix}packages`,
  deposits: `${prefix}deposits`,
};
