import e from "express";
import { UploadMiddleWare } from "../v1/middlewares/upload.js";

export const mediaRouter = e.Router();

mediaRouter.use("/photos", UploadMiddleWare.load_static_photo());
