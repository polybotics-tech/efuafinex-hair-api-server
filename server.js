import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

import { v1 } from "./v1/index.js";
import { ErrorMiddleware } from "./v1/middlewares/error.js";

//initialize port and server
const PORT = process.env.PORT || 5050;
const server = express();
const upload = multer();

//server configuration for CORS
server.use(cors());
//server configuration to read as json format
server.use(express.json());
server.use(
  express.urlencoded({
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
server.use("/v1", upload.any(), v1);

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
