import Joi from "joi";

export const UserSchema = {
  update_account: Joi.object({
    fullname: Joi.string().min(3).required().messages({
      "any.required": "Please provide a legal full name",
      "string.empty": "Please provide a legal full name",
      "string.min": "Please provide a legal full name",
    }),
    phone: Joi.number().required().messages({
      "any.required": "Please provide a valid phone number",
      "number.empty": "Please provide a valid phone number",
    }),
  }),
  update_pass: Joi.object({
    pass: Joi.string().required().messages({
      "any.required": "Please provide your account's current password",
      "string.empty": "Please provide your account's current password",
    }),
    new_pass: Joi.string()
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
      )
      .min(8)
      .max(20)
      .required()
      .messages({
        "any.required": "Please provide a new password",
        "string.empty": "Please provide a new password",
        "string.min":
          "New password is too short, must be atleast 8 characters long",
        "string.max":
          "New password is too long, must be atmost 20 characters long",
        "string.pattern.base":
          "New password must contain atleast: 1 number, 1 uppercase and 1 lowercase letters, and any of these special characters - @$!",
      }),
    confirm_pass: Joi.string().valid(Joi.ref("new_pass")).required().messages({
      "any.required": "Confirm password must match new password",
      "any.only": "Confirm password must match new password",
    }),
  }),
  update_notify: Joi.object({
    push_notify: Joi.boolean().required().messages({
      "any.required": "Boolean value required for 'push_notify'",
    }),
    email_notify: Joi.boolean().required().messages({
      "any.required": "Boolean value required for 'email_notify'",
    }),
  }),
  admin: {
    update_account: Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Please provide a valid email address",
        "string.empty": "Please provide a valid email address",
        "string.email": "Please provide a valid email address",
      }),
      fullname: Joi.string().min(3).required().messages({
        "any.required": "Please provide a legal full name",
        "string.empty": "Please provide a legal full name",
        "string.min": "Please provide a legal full name",
      }),
      phone: Joi.number().required().messages({
        "any.required": "Please provide a valid phone number",
        "number.empty": "Please provide a valid phone number",
      }),
    }),
    update_pass: Joi.object({
      passcode: Joi.string().required().messages({
        "any.required": "Please provide your account's current passcode",
        "string.empty": "Please provide your account's current passcode",
      }),
      new_passcode: Joi.string()
        .regex(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
        )
        .min(6)
        .max(15)
        .required()
        .messages({
          "any.required": "Please provide a new passcode",
          "string.empty": "Please provide a new passcode",
          "string.min":
            "New passcode is too short, must be atleast 6 characters long",
          "string.max":
            "New passcode is too long, must be atmost 15 characters long",
          "string.pattern.base":
            "New passcode must contain atleast: 1 number, 1 uppercase and 1 lowercase letters, and any of these special characters - @$!",
        }),
      confirm_passcode: Joi.string()
        .valid(Joi.ref("new_passcode"))
        .required()
        .messages({
          "any.required": "Confirm passcode must match new passcode",
          "any.only": "Confirm passcode must match new passcode",
        }),
    }),
  },
};
