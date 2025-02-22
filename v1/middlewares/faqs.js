import { FaqsModel } from "../models/faqs.js";
import { UserModel } from "../models/user.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";

export const FaqsMiddleware = {
  validate_create_faqs_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.admin.create_faqs(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_create_contact_info_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.admin.create_contact_info(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_send_bulk_mail_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.admin.send_bulk_mail(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_faq_id_params: async (req, res, next) => {
    //grab the faq id
    const { faq_id } = req?.params;

    //fetch target faq
    const target_faq = await FaqsModel.fetch_faq_by_faq_id(faq_id);

    if (!target_faq) {
      DefaultHelper.return_error(res, 404, "FAQ not found");
      return;
    }

    //append to body request
    req.body.target_faq = target_faq;

    next();
  },
  create_faq: async (req, res, next) => {
    try {
      //create new faq
      const new_faq = await FaqsModel.create_faq(req?.body);

      if (!new_faq) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      //fetch new faq details
      const item = await FaqsModel.fetch_faq_by_id(new_faq);

      if (!item) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      req.body.item = item;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error has occured"
      );
      return;
    }
  },
  update_faq: async (req, res, next) => {
    try {
      const { target_faq } = req?.body;
      const { faq_id } = target_faq;

      //update faq
      const updated = await FaqsModel.update_faq(req?.body, faq_id);

      if (!updated) {
        DefaultHelper.return_error(res, 500, "Unable to update FAQ");
        return;
      }

      //fetch new faq details
      const item = await FaqsModel.fetch_faq_by_faq_id(faq_id);

      if (!item) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      req.body.item = item;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error has occured"
      );
      return;
    }
  },
  fetch_multiple_faqs: async (req, res, next) => {
    try {
      const { page } = req?.body;

      //fetch faqs by page
      const faqs = await FaqsModel.fetch_faqs(page);

      //meta data
      const tup = await FaqsModel.count_all_faqs();
      const meta = {
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.faqs = faqs;
      req.body.meta = meta;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  fetch_contact_info: async (req, res, next) => {
    try {
      const contact_info = await FaqsModel.fetch_contact_info();

      //append to body request
      req.body.contact_info = contact_info;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  create_contact_info: async (req, res, next) => {
    try {
      const { contact_info } = req?.body;

      //if contact info already exist,
      let create_update;

      if (contact_info) {
        //update existing contact
        create_update = await FaqsModel.update_contact_info(
          req?.body,
          contact_info?.id
        );
      } else {
        //create new contact
        create_update = await FaqsModel.create_contact_info(req?.body);
      }

      if (!create_update) {
        DefaultHelper.return_error(res, 400, "Unable to update contact info");
        return;
      }

      //fetch new/updated contact info
      const item = await FaqsModel.fetch_contact_info_by_id(
        contact_info?.id || create_update
      );

      if (!item) {
        DefaultHelper.return_error(
          res,
          500,
          "Internal server error has occured"
        );
        return;
      }

      req.body.item = item;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error has occured"
      );
      return;
    }
  },
  verify_choice_of_mail: async (req, res, next) => {
    try {
      const { is_bulk } = req?.body;

      if (Boolean(is_bulk || is_bulk === "true")) {
        //clear any predefined recipients
        req.body.recipients = [];
        let recipients = [];

        //fetch all verified app users
        const users = await UserModel.fetch_all_verified_users();

        if (!users) {
          DefaultHelper.return_error(
            res,
            400,
            "No recipient available for mail"
          );
          return;
        }

        //extract email from users and append to recipients
        users?.forEach((user) => {
          let email = user?.email;

          recipients.push(email);
        });

        //at the end, rewrite recipients in request body
        req.body.recipients = recipients;
      }

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error has occured"
      );
      return;
    }
  },
};
