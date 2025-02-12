import e from "express";
import multer from "multer";
import sharp from "sharp";
import { encode } from "blurhash";

import { config } from "../../config.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FileManagerUtility } from "../utils/file_manager.js";
import { API_REQUESTS } from "../hooks/api/requests.js";

// set up multer storage (temporary memory storage to access buffer)
const storage = multer.memoryStorage();

const single_upload = multer({
  storage: storage,
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
    const { body, file } = req;
    const { user_id } = body;

    //check wether a file was passed
    if (!file || !user_id) {
      return DefaultHelper.return_error(
        res,
        400,
        "Media upload failed. No media file found"
      );
    }

    // get file params
    const file_buffer = file.buffer;
    const file_mimetype = file?.mimetype;
    const file_initial_name = file?.filename;
    const file_size = file?.size;

    //check file type
    if (!FileManagerUtility.file_type_allowed(file_mimetype)) {
      return DefaultHelper.return_error(
        res,
        403,
        "Media upload failed. Unsupported media file type",
        {
          fileName: file_initial_name,
          fileMimeType: file_mimetype,
        }
      );
    }

    //check file size
    if (await FileManagerUtility.file_size_exceeds_limit(file_size)) {
      return DefaultHelper.return_error(
        res,
        413,
        `Media upload failed. file exceeds the ${DefaultHelper.format_size_to_readable(
          config.fileUpload.sizeLimit
        )} upload size limit`,
        {
          fileName: file_initial_name,
          fileSize: DefaultHelper.format_size_to_readable(file_size),
        }
      );
    }

    //resize file with sharp
    const optimized_buffer = await sharp(file_buffer)
      .jpeg()
      .resize({
        width: 1280,
        height: 1280,
      })
      .toBuffer();

    //save uploaded file to user folder in upload directory
    let saved_file = await FileManagerUtility.save_uploaded_file_to_path(
      optimized_buffer,
      user_id
    );

    //check file saved
    if (!saved_file) {
      return DefaultHelper.return_error(
        res,
        401,
        "Media upload failed. Error saving file to storage"
      );
    }

    //store upload url
    const upload_url = `${config.fileUpload.imageResourceDir}${user_id}/${saved_file}`;

    //-- create blur for uploaded photo optimization
    // specify number of components in each axes.
    const componentX = config.fileUpload.blur.componentX;
    const componentY = config.fileUpload.blur.componentY;

    // converting provided image to a byte buffer.
    const { data, info } = await sharp(optimized_buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({
        resolveWithObject: true,
      });

    const upload_blur = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      componentX,
      componentY
    );

    req.body.upload_url = upload_url;
    req.body.upload_blur = upload_blur;

    next();
  },
  validate_package_photo_uploaded: async (req, res, next) => {
    const { body, file } = req;
    const { user_id, has_photo } = body;

    if (Boolean(has_photo === "true")) {
      //check wether a file was passed
      if (!file || !user_id) {
        return DefaultHelper.return_error(
          res,
          400,
          "Media upload failed. No media file found"
        );
      }

      // get file params
      const file_buffer = file.buffer;
      const file_mimetype = file?.mimetype;
      const file_initial_name = file?.filename;
      const file_size = file?.size;

      //check file type
      if (!FileManagerUtility.file_type_allowed(file_mimetype)) {
        return DefaultHelper.return_error(
          res,
          403,
          "Media upload failed. Unsupported media file type",
          {
            fileName: file_initial_name,
            fileMimeType: file_mimetype,
          }
        );
      }

      //check file size
      if (await FileManagerUtility.file_size_exceeds_limit(file_size)) {
        return DefaultHelper.return_error(
          res,
          413,
          `Media upload failed. file exceeds the ${DefaultHelper.format_size_to_readable(
            config.fileUpload.sizeLimit
          )} upload size limit`,
          {
            fileName: file_initial_name,
            fileSize: DefaultHelper.format_size_to_readable(file_size),
          }
        );
      }

      //resize file with sharp
      const optimized_buffer = await sharp(file_buffer)
        .jpeg()
        .resize({
          width: 1280,
          height: 1280,
        })
        .toBuffer();

      //save uploaded file to user folder in upload directory
      let saved_file = await FileManagerUtility.save_uploaded_file_to_path(
        optimized_buffer,
        user_id
      );

      //check file saved
      if (!saved_file) {
        return DefaultHelper.return_error(
          res,
          401,
          "Media upload failed. Error saving file to storage"
        );
      }

      //store upload url
      const upload_url = `${config.fileUpload.imageResourceDir}${user_id}/${saved_file}`;

      //-- create blur for uploaded photo optimization
      // specify number of components in each axes.
      const componentX = config.fileUpload.blur.componentX;
      const componentY = config.fileUpload.blur.componentY;

      // converting provided image to a byte buffer.
      const { data, info } = await sharp(optimized_buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({
          resolveWithObject: true,
        });

      const upload_blur = encode(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
        componentX,
        componentY
      );

      req.body.upload_url = upload_url;
      req.body.upload_blur = upload_blur;
    }

    next();
  },
};

export const UploadHelper = {
  validate_google_photo_remote_url: async (req, user_id) => {
    const { photo_url } = req?.body;

    if (!photo_url || !user_id) {
      return false;
    }

    //fetch photo buffer array
    const buffer_array = await API_REQUESTS.RemoteImage.fetch_array_buffer(
      photo_url
    );

    if (!buffer_array) {
      return false;
    }

    const image_buffer = Buffer.from(buffer_array);

    //resize file with sharp
    const optimized_buffer = await sharp(image_buffer)
      .jpeg()
      .resize({
        width: 1280,
        height: 1280,
      })
      .toBuffer();

    //save uploaded file to user folder in upload directory
    let saved_file = await FileManagerUtility.save_uploaded_file_to_path(
      optimized_buffer,
      user_id
    );

    //check file saved
    if (!saved_file) {
      return false;
    }

    //store upload url
    const upload_url = `${config.fileUpload.imageResourceDir}${user_id}/${saved_file}`;

    //-- create blur for uploaded photo optimization
    // specify number of components in each axes.
    const componentX = config.fileUpload.blur.componentX;
    const componentY = config.fileUpload.blur.componentY;

    // converting provided image to a byte buffer.
    const { data, info } = await sharp(optimized_buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({
        resolveWithObject: true,
      });

    const upload_blur = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      componentX,
      componentY
    );

    req.body.upload_url = upload_url;
    req.body.upload_blur = upload_blur;

    return true;
  },
};
