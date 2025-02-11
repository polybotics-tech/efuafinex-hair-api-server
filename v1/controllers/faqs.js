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
};
