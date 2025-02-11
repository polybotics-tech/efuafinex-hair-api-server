import Joi from "joi";

export const PackageSchema = {
  create_package: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Please provide a package title",
    }),
    description: Joi.optional(),
    is_defined: Joi.boolean().required().messages({
      "any.required": "Please provide an 'is_defined' parameter",
    }),
    target_amount: Joi.optional(),
    auto_complete: Joi.boolean().required().messages({
      "any.required": "Please provide an 'auto_complete' parameter",
    }),
    fixed_deadline: Joi.boolean().required().messages({
      "any.required": "Please provide a 'fixed_deadline' parameter",
    }),
    duration: Joi.optional(),
    deadline: Joi.optional(),
    has_photo: Joi.boolean().required().messages({
      "any.required": "Please provide a 'has_photo' parameter",
    }),
  }),
};
