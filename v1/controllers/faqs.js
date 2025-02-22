import { FaqsModel } from "../models/faqs.js";
import { UserEvent } from "../subscribers/user.js";
import { DefaultHelper } from "../utils/helpers.js";

export const FaqsController = {
  create_new_faq: async (req, res) => {
    const { item } = req?.body;

    if (!item) {
      DefaultHelper.return_error(res, 400, "Unable to create FAQ");
      return;
    }

    //if item stored in request body, return data
    let data = item;

    //
    DefaultHelper.return_success(res, 201, "FAQ created successfully", data);
    return;
  },
  update_existing_faq: async (req, res) => {
    const { item } = req?.body;

    if (!item) {
      DefaultHelper.return_error(res, 400, "Unable to update FAQ");
      return;
    }

    //if item stored in request body, return data
    let data = item;

    //
    DefaultHelper.return_success(res, 201, "FAQ updated successfully", data);
    return;
  },
  delete_existing_faq: async (req, res) => {
    const { target_faq } = req?.body;
    const { faq_id } = target_faq;

    const attempt_del = await FaqsModel.delete_faq_by_faq_id(faq_id);

    if (!attempt_del) {
      DefaultHelper.return_error(res, 400, "Unable to delete FAQ");
      return;
    }

    let data = true;

    //
    DefaultHelper.return_success(res, 201, "FAQ deleted successfully", data);
    return;
  },
  fetch_faqs: async (req, res) => {
    const { faqs, meta } = req?.body;

    if (!faqs || !meta) {
      DefaultHelper.return_error(res, 400, "Unable to fetch FAQs");
      return;
    }

    //if meta and faqs stored in request body, return data
    let data = { faqs, meta };

    //
    DefaultHelper.return_success(res, 200, "FAQs fetched successfully", data);
    return;
  },
  fetch_contact_info: async (req, res) => {
    const { contact_info } = req?.body;

    //if contact_info stored in request body, return data
    let data = contact_info;

    //
    DefaultHelper.return_success(
      res,
      200,
      "Contact info fetched successfully",
      data
    );
    return;
  },
  create_update_contact_info: async (req, res) => {
    const { item } = req?.body;

    if (!item) {
      DefaultHelper.return_error(res, 400, "Unable to update contact info");
      return;
    }

    //if item stored in request body, return data
    let data = item;

    //
    DefaultHelper.return_success(
      res,
      201,
      "Contact info updated successfully",
      data
    );
    return;
  },
  send_bulk_mail: async (req, res) => {
    const { subject, body, recipients } = req?.body;

    if (!recipients) {
      DefaultHelper.return_error(res, 400, "No recipient available for mail");
      return;
    }

    //call send-bulk-mails event
    let data = { recipients, subject, body };
    UserEvent.emit("send-bulk-mails", { data });

    //return sucess
    DefaultHelper.return_success(
      res,
      200,
      "Bulk mail was sent successfully",
      data
    );
  },
};
