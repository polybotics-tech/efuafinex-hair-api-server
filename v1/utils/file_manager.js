import fs from "fs";
import { config } from "../../config.js";
import { logbot } from "../../logger.js";

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
  delete_file_by_path: async (file_path) => {
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
  move_uploaded_asset: async (oldPath, newPath, callback) => {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        if (err.code === "EXDEV") {
          rewrite();
        } else {
          logbot.Error(
            `Temp File Move failed - ${JSON.stringify({
              message: "Tmp file could not be moved to designated path",
              errMsg: err,
              meta: { oldPath, newPath },
            })}`
          );
        }
        return;
      }
      //callback();
    });

    function rewrite() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);

      readStream.on("error", callback);
      writeStream.on("error", callback);

      readStream.on("close", function () {
        fs.unlink(oldPath, callback);
      });

      readStream.pipe(writeStream);
    }
  },
};
