import Joi from "joi";

export const PackageSchema = {
  create_package: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Please provide a package title",
    }),
    description: Joi.string().optional().messages({}),
    is_defined: Joi.boolean().required().messages({
      "any.required": "Please provide a 'is_defined' parameter",
    }),
    target_amount: Joi.number().optional().messages({}),
    auto_complete: Joi.boolean().required().messages({
      "any.required": "Please provide a 'auto_complete' parameter",
    }),
    fixed_deadline: Joi.boolean().required().messages({
      "any.required": "Please provide a 'fixed_deadline' parameter",
    }),
    duration: Joi.string().optional().messages({}),
    deadline: Joi.date().optional().messages({}),
    has_photo: Joi.boolean().required().messages({
      "any.required": "Please provide a 'has_photo' parameter",
    }),
  }),
};
