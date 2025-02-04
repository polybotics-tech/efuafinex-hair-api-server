import nodeFileLogger from "node-file-logger";
import { config } from "./config.js";

nodeFileLogger.SetUserOptions(config.logger);

export const logbot = nodeFileLogger;
