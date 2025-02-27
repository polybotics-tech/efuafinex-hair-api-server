import { API_REQUESTS } from "../hooks/api/requests.js";
import { DepositModel } from "../models/deposit.js";
import { TransferModel } from "../models/transfer.js";
import { DepositEvent } from "../subscribers/deposit.js";
import { DefaultHelper } from "../utils/helpers.js";
import { FormValidator } from "./validator.js";

export const DepositMiddleware = {
  validate_make_deposit_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.make_deposit(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  confirm_amount_within_range: async (req, res, next) => {
    const { amount, target_package } = req?.body;
    const { package_type, target_amount, available_amount } = target_package;

    if (package_type === "defined") {
      //check if amount is less than or equal to remaining balance payable
      let payable_bal = Number(target_amount - available_amount);

      if (amount > payable_bal) {
        DefaultHelper.return_error(
          res,
          401,
          `Amount entered exceeds payable balance - N${payable_bal}`
        );
        return;
      }
    }

    //calculate amount fee charge
    const fee_charged = DefaultHelper.calculate_fee_charge_from_amount(amount);

    //proceed
    req.body.fee_charged = fee_charged;
    next();
  },
  initialize_transaction_with_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { amount, fee_charged, user, target_package } = req?.body;
      const { user_id, email } = user;
      const { package_id } = target_package;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.initialize_transaction(
        email,
        amount,
        package_id,
        user_id,
        fee_charged
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //if request successful, create deposit record on db
      const { reference, authorization_url } = ps_response;
      const amount_expected = Number(amount);

      const form = {
        user_id,
        package_id,
        transaction_ref: reference,
        amount_expected,
        authorization_url,
        fee_charged,
      };

      const create_record = await DepositModel.create_new_deposit_record(form);

      if (!create_record) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //fetch created record
      const deposit = await DepositModel.fetch_deposit_by_id(create_record);

      //append to body request
      req.body.deposit = deposit;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        400,
        error?.message || "Connection error. Please try again later"
      );
      return;
    }
  },
  validate_transaction_reference_query: async (req, res, next) => {
    //grab the  transaction ref
    const { reference } = req?.query;

    //fetch deposit record
    const deposit_record = await DepositModel.fetch_deposit_by_transaction_ref(
      reference
    );

    if (!deposit_record) {
      DefaultHelper.return_error(res, 200, "Deposit record not found");
      return;
    }

    //append to body request
    req.body.reference = reference;
    req.body.deposit_record = deposit_record;

    next();
  },
  validate_transaction_reference_params: async (req, res, next) => {
    //grab the transaction ref
    const { transaction_ref } = req?.params;

    //fetch deposit record
    const deposit_record = await DepositModel.fetch_deposit_by_transaction_ref(
      transaction_ref
    );

    if (!deposit_record) {
      DefaultHelper.return_error(res, 404, "Deposit record not found");
      return;
    }

    //append to body request
    req.body.reference = transaction_ref;
    req.body.deposit_record = deposit_record;

    next();
  },
  validate_deposit_ownership: async (req, res, next) => {
    const { user_id, deposit_record } = req?.body;

    if (user_id != deposit_record?.user_id) {
      DefaultHelper.return_error(
        res,
        401,
        "Access denied. Permission not granted"
      );
      return;
    }

    next();
  },
  fetch_user_deposits: async (req, res, next) => {
    try {
      const { user, page, sort, q } = req?.body;
      const { user_id } = user;

      //fetch deposits by user_id
      const deposits = await DepositModel.fetch_user_deposits(
        user_id,
        page,
        sort,
        q
      );

      //meta data
      const tup = await DepositModel.count_all_user_deposits(user_id, sort, q);
      const meta = {
        user_id,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.deposits = deposits;
      req.body.meta = meta;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  fetch_package_deposits: async (req, res, next) => {
    try {
      const { target_package, page } = req?.body;
      const { package_id } = target_package;

      //fetch deposits by package_id
      const deposits = await DepositModel.fetch_package_deposits(
        package_id,
        page
      );

      //meta data
      const tup = await DepositModel.count_all_package_deposits(package_id);
      const meta = {
        package_id,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.deposits = deposits;
      req.body.meta = meta;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  verify_transaction_ref_with_paystack: async (req, res, next) => {
    const { reference, deposit_record } = req?.body;

    //send request to paystack to verify transaction
    const verify_response = await API_REQUESTS.Paystack.verify_transaction(
      reference
    );

    if (verify_response) {
      let data = {
        reference,
        deposit_record,
      };

      DepositEvent.emit("update-status", { data });

      next();
    } else {
      DefaultHelper.return_error(res, 404, "Unable to verify transaction");
    }
  },
  fetch_multiple_deposits: async (req, res, next) => {
    try {
      const { q, page, sort } = req?.body;

      //fetch deposits by q and page
      const deposits = await DepositModel.fetch_multiple_deposits(
        q,
        page,
        sort
      );

      //meta data
      const tup = await DepositModel.count_all_multiple_deposits(q, sort);
      const meta = {
        q,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.deposits = deposits;
      req.body.meta = meta;

      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
  fetch_total_transactions: async (req, res, next) => {
    try {
      let { q } = req?.body;

      if (!q || isNaN(q) || q === "") {
        let d = new Date();
        q = d.getFullYear(); //if q is not defined, set q to current year
      }

      //fetch deposits by q which is year
      const total_deposits = await DepositModel.sum_deposits_by_year(q);

      //fetch transfers by q which is year
      const total_transfers = await TransferModel.sum_transfers_by_year(q);

      req.body.total_deposits = total_deposits;
      req.body.total_cashouts = total_transfers;
      next();
    } catch (error) {
      DefaultHelper.return_error(
        res,
        500,
        error?.message || "Internal server error occured"
      );
      return;
    }
  },
};
