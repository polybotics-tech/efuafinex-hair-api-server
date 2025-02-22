import Joi from "joi";

export const FaqsSchema = {
  create_faqs: Joi.object({
    question: Joi.string().required().messages({
      "any.required": "Please provide a frequent question",
      "string.empty": "Please provide a frequent question",
    }),
    answer: Joi.string().required().messages({
      "any.required": "Please provide an answer to this question",
      "string.empty": "Please provide an answer to this question",
    }),
    tags: Joi.optional(),
  }),
  create_contact_info: Joi.object({
    email: Joi.optional(),
    instagram: Joi.optional(),
    whatsapp: Joi.optional(),
  }),
  send_bulk_mail: Joi.object({
    subject: Joi.string().required().messages({
      "any.required": "A subject is required to send mail",
      "string.empty": "A subject is required to send mail",
    }),
    body: Joi.string().required().messages({
      "any.required": "The body of the mail is required",
      "string.empty": "The body of the mail is required",
    }),
    is_bulk: Joi.boolean(),
    recipients: Joi.optional(),
  }),
};
