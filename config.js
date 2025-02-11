import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const config = {
  db: {
    host: process.env.EFH_DB_HOST,
    user: process.env.EFH_DB_USER,
    password: process.env.EFH_DB_PASS,
    database: process.env.EFH_DB_NAME,
    connectTimeout: 60000,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    timezone: "Z",
  },
  logger: {
    timeZone: "Africa/Lagos",
    folderPath: "./logs/",
    dateBasedFileNaming: true,
    fileNamePrefix: "log_",
    fileNameExtension: ".log",
    dateFormat: "YYYY_MM_D",
    timeFormat: "h:mm:ss A",
    onlyFileLogging: true, //change to true on production / false on debugging stage
  },
  paystack: {
    secretKey: process.env.EFH_PAYSTACK_SECRET_KEY,
    publicKey: process.env.EFH_PAYSTACK_PUBLIC_KEY,
  },
  deposit: {
    minimumAllowed: 100,
    maximumAllowed: 500000,
  },
  publicPath: {
    depositSuccess: "http://192.168.138.31:5050/v1/deposit/success",
  },
  fileUpload: {
    sizeLimit: 30 * 1024 * 1024, //maximum file size allowed for upload  - 30mb
    tmpUploadDir: path.join(__dirname, "/uploads/tmp/"),
    imageUploadDir: path.join(__dirname, "/uploads/photos/"),
    imageResourceDir: "/media/photos/",
    uploadedAssetDir: path.join(__dirname, "/uploads/"),
    blur: {
      componentX: 4,
      componentY: 3,
    },
  },
  email: {
    server: process.env.VCN_MAIL_SERVER,
    account: process.env.VCN_EMAIL_ACCOUNT,
    password: process.env.VCN_EMAIL_PASSWORD,
    support: "support@votecity.ng",
    website: "https://www.votecity.ng",
    title: "EFUAFINEX HAIR",
  },
  pageLimit: 20, //20
  tokenSecretKey: process.env.EFH_TOKEN_SECRET_KEY,
  tokenAuthorizationKey: process.env.EFH_TOKEN_AUTH_KEY,
  tokenExpiry: "5d",
  bcryptHashSalt: process.env.EFH_BCRYPT_HASH_SALT,
};
