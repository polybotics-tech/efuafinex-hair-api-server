import Joi from "joi";

export const TransferSchema = {
  verify_transfer_account: Joi.object({
    account_number: Joi.number().required().messages({
      "any.required": "Please provide an account number",
      "number.empty": "Please provide an account number",
    }),
    bank_code: Joi.number().required().messages({
      "any.required": "Please choose a bank",
      "number.empty": "Please choose a bank",
    }),
  }),
  request_transfer: Joi.object({
    account_name: Joi.string().required().messages({
      "any.required": "Please verify account name to proceed",
      "string.empty": "Please verify account name to proceed",
    }),
    account_number: Joi.number().required().messages({
      "any.required": "Please provide an account number",
      "number.empty": "Please provide an account number",
    }),
    bank_code: Joi.number().required().messages({
      "any.required": "Please choose a bank",
      "number.empty": "Please choose a bank",
    }),
    recipient_code: Joi.string().required().messages({
      "any.required": "Please verify account to get recipient code",
      "string.empty": "Please verify account to get recipient code",
    }),
    reason: Joi.string().required().messages({
      "any.required": "Please provide a reason for this request",
      "number.empty": "Please provide a reason for this request",
    }),
  }),
  finalize_transfer: Joi.object({
    otp: Joi.number().required().messages({
      "any.required": "Please provide a valid OTP",
      "number.empty": "Please provide a valid OTP",
    }),
  }),
};
