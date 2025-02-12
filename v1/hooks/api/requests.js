import axios from "axios";
import { config } from "../../../config.js";
import { PasystackEndpoints } from "./endpoints.js";
import { IdGenerator } from "../../utils/id_generator.js";

const auth_header = {
  headers: {
    Authorization: `Bearer ${config.paystack.secretKey}`,
    "Content-Type": "application/json",
  },
};

export const API_REQUESTS = {
  Paystack: {
    request_pwt: async (email, amount, package_id, user_id) => {
      try {
        const options = {
          email,
          amount: amount * 100,
          reference: IdGenerator.transaction_ref(),
          metadata: {
            user_id,
            package_id,
          },
          bank_transfer: {
            account_expires_at: null,
          },
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.charge.initialize,
          options,
          auth_header
        );

        console.log("pwt res: ", response);
        let result = response.data;
        const { status, data } = result;

        if (!status) {
          return false;
        }

        return data;
      } catch (error) {
        return false;
      }
    },
    initialize_transaction: async (
      email,
      amount,
      package_id,
      user_id,
      fee_charged
    ) => {
      try {
        const options = {
          email,
          amount: amount * 100,
          reference: IdGenerator.transaction_ref(),
          metadata: {
            user_id,
            package_id,
            fee_charged,
          },
          callback_url: config.publicPath.depositSuccess,
          channels: ["card"],
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.transaction.initialize,
          options,
          auth_header
        );

        let result = response.data;
        const { status, data } = result;

        if (!status) {
          return false;
        }

        return data;
      } catch (error) {
        return false;
      }
    },
    verify_transaction: async (reference) => {
      try {
        //send request
        const response = await axios.get(
          PasystackEndpoints.transaction.verify(reference),
          auth_header
        );

        let result = response.data;
        const { status, data } = result;

        if (!status) {
          return false;
        }

        return data;
      } catch (error) {
        return false;
      }
    },
  },
  RemoteImage: {
    fetch_array_buffer: async (image_url) => {
      try {
        // Fetch the image from the remote URL
        const response = await axios({
          url: image_url,
          responseType: "arraybuffer", // Get the image as a buffer
        });

        if (!response) {
          return false;
        }
        const { data } = response;
        return data;
      } catch (error) {
        return false;
      }
    },
  },
};
