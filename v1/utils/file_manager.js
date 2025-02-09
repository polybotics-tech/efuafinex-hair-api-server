import fs from "fs";
import path from "path";
import { config } from "../../config.js";
import { logbot } from "../../logger.js";
import { IdGenerator } from "./id_generator.js";

//check if file exists
const does_file_exists = async (file_path) => {
  let exists = true;
  try {
    fs.accessSync(file_path, fs.constants.F_OK);
  } catch (e) {
    exists = false;
  }
  return exists;
};

export const FileManagerUtility = {
  file_type_allowed: async (mimetype) => {
    //extract file type
    const allowed_type = ["png", "jpg", "jpeg"];
    const file_mime = mimetype.split("/")[0];
    const file_type = mimetype.split("/")[1];

    return Boolean(file_mime === "image" && allowed_type.includes(file_type));
  },
  file_size_exceeds_limit: async (size) => {
    const limit = config.fileUpload.sizeLimit;
    let exceeds = Boolean(Number(size) >= Number(limit));

    return exceeds;
  },
  delete_uploaded_asset: async (url) => {
    let file_path = "";

    //first check if url is in correct format
    let check_split = url.split("/media/");
    if (!check_split || !check_split[1]) {
      return false;
    }

    //re-route url to asset folder
    let file = check_split[1];
    file_path = config.fileUpload.uploadedAssetDir + file;

    //check if file exists
    let file_exists = await does_file_exists(file_path);
    if (!file_exists) {
      return false;
    }

    //proceed to delete existing file
    fs.unlink(file_path, (err) => {
      if (err) {
        logbot.Error(
          `File Deletion failed - ${JSON.stringify({
            message: "File could not be deleted from designated path",
            errMsg: err,
            meta: { file: file_path },
          })}`
        );
        return false;
      }

      //file deleted
      logbot.Info(
        `File Deletion successful - ${JSON.stringify({
          message: "File has been deleted from designated path",
          meta: { file: file_path },
        })}`
      );
      return true;
    });

    return true;
  },
  save_uploaded_file_to_path: async (buffer, user_id) => {
    // check and make upload directory
    const uploadDir = path.join(config.fileUpload.imageUploadDir, user_id);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // generate unique filename
    const fileName = IdGenerator.photo_upload_name();
    const filePath = path.join(uploadDir, fileName);

    // Save file to directory
    if (buffer) {
      fs.writeFileSync(filePath, buffer);
      return fileName;
    } else {
      return false;
    }
  },
};
