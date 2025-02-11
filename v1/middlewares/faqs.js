import { FaqsModel } from "../models/faqs.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";

export const FaqsMiddleware = {
  validate_create_faqs_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.create_faqs(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

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
  fetch_multiple_faqs: async (req, res, next) => {
    try {
      const { page } = req?.body;

      //fetch faqs by user_id
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
};
