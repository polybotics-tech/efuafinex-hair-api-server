const PS_HOST = "https://api.paystack.co";

export const PasystackEndpoints = {
  transaction: {
    initialize: PS_HOST + "/transaction/initialize",
    verify: (reference) => PS_HOST + "/transaction/verify/" + reference,
  },
  charge: {
    initialize: PS_HOST + "/charge",
  },
};
