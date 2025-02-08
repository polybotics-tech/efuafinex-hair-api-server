import "dotenv/config";

const prefix = process.env.EFH_DB_PREFIX;

export const db_tables = {
  users: `${prefix}users`,
  otp_verifications: `${prefix}otp_verifications`,
  packages: `${prefix}packages`,
  deposits: `${prefix}deposits`,
};
