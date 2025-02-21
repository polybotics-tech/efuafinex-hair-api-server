import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

export const Tokenizer = {
  generate_token: (user_id) => {
    let token = jsonwebtoken.sign({ user_id }, config.tokenSecretKey, {
      expiresIn: config.tokenExpiry,
    });

    return token;
  },
  generate_admin_token: (admin_id) => {
    let token = jsonwebtoken.sign({ admin_id }, config.tokenSecretKey, {
      expiresIn: config.tokenExpiry,
    });

    return token;
  },

  decode_token: (token) => {
    let decoded = jsonwebtoken.verify(token, config.tokenSecretKey);

    return decoded;
  },

  get_token_expiry: () => {
    return config.tokenExpiry;
  },
};
