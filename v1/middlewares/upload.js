import e from "express";
import multer from "multer";
import { config } from "../../config.js";
import { IdGenerator } from "../utils/id_generator.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FileManagerUtility } from "../utils/file_manager.js";

//initiate storages for multer
const photo_upload_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.fileUpload.tmpUploadDir);
  },
  filename: function (req, file, cb) {
    const new_file_name = IdGenerator.photo_upload_name(file);

    cb(null, new_file_name);
  },
});

const single_upload = multer({
  storage: photo_upload_storage,
  limits: { fileSize: config.fileUpload.sizeLimit },
}).single("file");

export const UploadMiddleWare = {
  load_static_photo: () => e.static(config.fileUpload.imageUploadDir),
  upload_single_image: async (req, res, next) => {
    single_upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log("upload error multer: ", err);
        return DefaultHelper.return_error(
          res,
          500,
          "Media upload not successful"
        );
      } else if (err) {
        console.log("upload error: ", err);
        return DefaultHelper.return_error(
          res,
          500,
          "Media upload not successful"
        );
      } else {
        // Everything went fine.
        next();
      }
    });
  },
  validate_single_image_uploaded: async (req, res, next) => {
    const { user_id } = req?.body;

    //check wether a file was passed
    if (!req?.file || !user_id) {
      return DefaultHelper.return_error(
        res,
        400,
        "Media upload failed. No media file found"
      );
    }

    //reading the media file sent
    const media_file = req?.file;

    const media_tmp_mimetype = media_file?.mimetype;
    const media_tmp_path = media_file?.path;
    const media_tmp_file_name = media_file?.filename;
    const media_tmp_size = media_file?.size;

    //extract file type
    const allowed_type = ["png", "jpg", "jpeg"];
    const file_mime = media_tmp_mimetype.split("/")[0];
    const file_type = media_tmp_mimetype.split("/")[1];

    //check file type
    if (file_mime != "image" || !allowed_type.includes(file_type)) {
      //attempt to delete tmp file
      let del = await FileManagerUtility.delete_file_by_path(media_tmp_path);

      return return_error(
        res,
        403,
        "Media upload failed. Unsupported media file type",
        {
          fileName: media_tmp_file_name,
          fileType: file_type,
        }
      );
    }

    //check file size
    if (parseInt(media_tmp_size) >= parseInt(config.fileUpload.sizeLimit)) {
      //attempt to delete tmp file
      let del = await FileManagerUtility.delete_file_by_path(media_tmp_path);

      return return_error(
        res,
        413,
        `Media upload failed. file exceeds the ${DefaultHelper.format_size_to_readable(
          config.fileUpload.sizeLimit
        )} upload size limit`,
        {
          fileName: media_tmp_file_name,
          fileSize: DefaultHelper.format_size_to_readable(media_tmp_size),
        }
      );
    }

    //move uploaded tmp file to user folder in upload directory
    let new_path = DefaultHelper.return_new_tmp_path(
      user_id,
      media_tmp_file_name
    );
    const dynamicFolder = `${config.fileUpload.imageUploadDir}${user_id}/`;
    await FileManagerUtility.move_uploaded_asset(
      media_tmp_path,
      new_path,
      dynamicFolder
    );

    //store upload url
    const upload_url = `${config.fileUpload.imageResourceDir}${user_id}/${media_tmp_file_name}`;
    req.body.upload_url = upload_url;

    next();
  },
};
