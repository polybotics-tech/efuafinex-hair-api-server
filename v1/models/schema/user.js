import Joi from "joi";

export const UserSchema = {
  update_pass: Joi.object({
    pass: Joi.string().required().messages({
      "any.required": "Please provide the account's current password",
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
};
