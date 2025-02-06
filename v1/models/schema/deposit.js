import Joi from "joi";
import { config } from "../../../config.js";

const minDA = config.deposit.minimumAllowed;
const maxDA = config.deposit.maximumAllowed;

export const DepositSchema = {
  make_deposit: Joi.object({
    amount: Joi.number()
      .min(minDA)
      .max(maxDA)
      .required()
      .messages({
        "any.required": "Please provide an amount to deposit",
        "number.min": `Minimum amount allowed is N${minDA}`,
        "number.max": `Maximum amount allowed per deposit is N${maxDA}`,
      }),
  }),
};
