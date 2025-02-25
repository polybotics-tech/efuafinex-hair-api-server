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
          channels: ["card", "bank_transfer"],
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
    verify_transfer_account: async (account_number, bank_code) => {
      try {
        //send request
        const response = await axios.get(
          PasystackEndpoints.bank.resolve(account_number, bank_code),
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
    verify_transfer: async (reference) => {
      try {
        //send request
        const response = await axios.get(
          PasystackEndpoints.transfer.verify(reference),
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
    create_transfer_recipient: async (account_number, bank_code, name) => {
      try {
        const options = {
          type: "nuban",
          currency: "NGN",
          name,
          account_number,
          bank_code,
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.transfer.recipient,
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
    fetch_paystack_balance: async () => {
      try {
        //send request
        const response = await axios.get(
          PasystackEndpoints.balance.check,
          auth_header
        );

        let result = response.data;
        const { status, data } = result;

        if (!status) {
          return false;
        }

        return data[0];
      } catch (error) {
        return false;
      }
    },
    resend_transfer_otp: async (transfer_code) => {
      try {
        const options = {
          transfer_code,
          reason: "transfer",
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.transfer.resend_otp,
          options,
          auth_header
        );

        let result = response.data;
        const { status } = result;

        if (!status) {
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    initiate_transfer: async (amount, reference, recipient_code, reason) => {
      try {
        const options = {
          source: "balance",
          currency: "NGN",
          reason,
          amount: Number(amount * 100),
          recipient: recipient_code,
          reference,
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.transfer.initiate,
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
    finalize_transfer: async (transfer_code, otp) => {
      try {
        const options = {
          transfer_code,
          otp,
        };

        //send request
        const response = await axios.post(
          PasystackEndpoints.transfer.finalize,
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
