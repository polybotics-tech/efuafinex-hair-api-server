const PS_HOST = "https://api.paystack.co";

export const PasystackEndpoints = {
  transaction: {
    initialize: PS_HOST + "/transaction/initialize",
    verify: (reference) => PS_HOST + "/transaction/verify/" + reference,
  },
  charge: {
    initialize: PS_HOST + "/charge",
  },
  bank: {
    resolve: (account_number, bank_code) =>
      PS_HOST +
      `/bank/resolve/?account_number=${account_number}&bank_code=${bank_code}`,
  },
  transfer: {
    recipient: PS_HOST + "/transferrecipient",
    initiate: PS_HOST + "/transfer",
    finalize: PS_HOST + "/transfer/finalize_transfer",
    resend_otp: PS_HOST + "/transfer/resend_otp",
    verify: (reference) => PS_HOST + "/transfer/verify/" + reference,
  },
  balance: {
    check: PS_HOST + "/balance",
  },
};
