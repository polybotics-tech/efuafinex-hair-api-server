import "dotenv/config";

const prefix = process.env.EFH_DB_PREFIX;

export const db_tables = {
  admins: `${prefix}admins`,
  users: `${prefix}users`,
  otp_verifications: `${prefix}otp_verifications`,
  packages: `${prefix}packages`,
  deposits: `${prefix}deposits`,
  transfers: `${prefix}transfers`,
  faqs: `${prefix}faqs`,
  contact_info: `${prefix}contact_info`,
  notifications: `${prefix}notifications`,
};
