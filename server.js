import "dotenv/config";
import express from "express";
import cors from "cors";

import { v1 } from "./v1/index.js";
import { ErrorMiddleware } from "./v1/middlewares/error.js";
import { mediaRouter } from "./uploads/index.js";

//initialize port and server
const PORT = process.env.PORT || 5050;
const server = express();

//server configuration for CORS
server.use(cors());
//server configuration to read as json format
server.use(express.json({ limit: "50mb" }));
server.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

//define routes
server.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Efuafinix hair api reached",
  });
});

//--api version 1
server.use("/v1", v1);

// --medias
server.use("/media", mediaRouter);

// this is default in case of unmatched routes
server.use(ErrorMiddleware.handle_unmatched_routes);

//error handlers
server.use(ErrorMiddleware.handle_thrown_error);

process.on("uncaughtException", ErrorMiddleware.handle_uncaught_exceptions);

server.listen(PORT, () => {
  console.log(
    "efuafinix hair api server running...............on port: ",
    PORT
  );
});
