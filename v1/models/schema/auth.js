import Joi from "joi";

export const AuthSchema = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Please provide a valid email address",
      "string.empty": "Please provide a valid email address",
      "string.email": "Please provide a valid email address",
    }),
    pass: Joi.string().required().messages({
      "any.required": "Please provide a password",
      "string.empty": "Please provide a password",
    }),
  }),
  register: Joi.object({
    fullname: Joi.string().min(3).required().messages({
      "any.required": "Please provide a legal full name",
      "string.empty": "Please provide a legal full name",
      "string.min": "Please provide a legal full name",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Please provide a valid email address",
      "string.empty": "Please provide a valid email address",
      "string.email": "Please provide a valid email address",
    }),
    pass: Joi.string()
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
      )
      .min(8)
      .max(20)
      .required()
      .messages({
        "any.required": "Please provide a password",
        "string.empty": "Please provide a password",
        "string.min":
          "Password is too short, must be atleast 8 characters long",
        "string.max": "Password is too long, must be atmost 20 characters long",
        "string.pattern.base":
          "Password must contain atleast: 1 number, 1 uppercase and 1 lowercase letters, and any of these special characters - @$!",
      }),
    phone: Joi.number().required().messages({
      "any.required": "Please provide a valid phone number",
      "number.empty": "Please provide a valid phone number",
    }),
    confirm_pass: Joi.string().valid(Joi.ref("pass")).required().messages({
      "any.required": "Confirm password must match password",
      "any.only": "Confirm password must match password",
    }),
  }),
  forgot_pass: Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Please provide a valid email address",
      "string.empty": "Please provide a valid email address",
      "string.email": "Please provide a valid email address",
    }),
  }),
  reset_pass: Joi.object({
    new_pass: Joi.string()
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
      )
      .min(8)
      .max(20)
      .required()
      .messages({
        "any.required": "Please provide a new password",
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
  otp_verification: Joi.object({
    otp: Joi.number().required().messages({
      "any.required": "Please provide a valid otp",
    }),
    user_id: Joi.string().required().messages({
      "any.required": "User ID is required for this request",
    }),
  }),
};
