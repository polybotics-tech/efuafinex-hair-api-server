import { logbot } from "../../logger.js";

export const ErrorMiddleware = {
  handle_unmatched_routes: (req, res) => {
    // Invalid route request
    let meta = {
      body: req?.body,
      method: req?.method,
      path: req?.originalUrl,
      message: "Route not found",
    };

    logbot.Info(`Invalid request route - ${JSON.stringify(meta)}`);

    return res
      .status(404)
      .json({
        success: false,
        message: meta?.message,
        data: {
          path: meta?.path,
          method: meta?.method,
        },
      })
      .end();
  },

  handle_thrown_error: (err, req, res) => {
    const statusCode = err.statusCode || 500;

    let meta = {
      body: req?.body,
      message: err?.message,
      errCode: statusCode,
      errType: err?.code,
      stack: err?.stack,
    };

    logbot.Error(`Internal server error - ${JSON.stringify(meta)}`);

    return res
      .status(statusCode)
      .json({
        success: false,
        message: meta?.message,
      })
      .end();
  },

  handle_uncaught_exceptions: (err) => {
    console.log("uerr: ", err);

    logbot.Error(`uncaughtException Error - ${err?.message}`);

    process.exit(1);
    return;
  },
};
