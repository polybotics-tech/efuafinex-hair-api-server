import Joi from "joi";

export const FaqsSchema = {
  create_faqs: Joi.object({
    question: Joi.string().required().messages({
      "any.required": "Please provide a frequent question",
    }),
    answer: Joi.string().required().messages({
      "any.required": "Please provide an answer to this question",
    }),
    tags: Joi.optional(),
  }),
};
