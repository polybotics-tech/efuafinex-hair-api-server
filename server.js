import "dotenv/config";
import express from "express";
import { v1 } from "./v1/index.js";

//initialize port and server
const PORT = process.env.PORT || 5050;
const server = express();

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

server.use("/v1", v1);

server.listen(PORT, () => {
  console.log("server running at port: ", PORT);
});
