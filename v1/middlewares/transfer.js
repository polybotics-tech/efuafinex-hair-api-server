import { API_REQUESTS } from "../hooks/api/requests.js";
import { TransferModel } from "../models/transfer.js";
import { TransferEvent } from "../subscribers/transfer.js";
import { DefaultHelper } from "../utils/helpers.js";
import { IdGenerator } from "../utils/id_generator.js";
import { FormValidator } from "./validator.js";

export const TransferMiddleware = {
  validate_verify_account_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.admin.verify_transfer_account(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_request_transfer_form: async (req, res, next) => {
    let form = req?.body;

    //validate request
    const { error, value } = FormValidator.admin.request_transfer(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  validate_finalize_transfer_form: async (req, res, next) => {
    let form = req?.body;

    //validate finalize
    const { error, value } = FormValidator.admin.finalize_transfer(form);

    // return if error
    if (error) {
      DefaultHelper.return_error(res, 401, error?.details[0]?.message, form);
      return;
    }

    next();
  },
  verify_transfer_account_with_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { account_number, bank_code } = req?.body;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.verify_transfer_account(
        account_number,
        bank_code
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Account validation was not successful"
        );
        return;
      }

      //if request successful, attach account name to body
      const { account_name } = ps_response;

      //append to body request
      req.body.account_name = account_name;
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
  verify_transaction_ref_with_paystack: async (req, res, next) => {
    const { reference, transfer_record } = req?.body;

    //send request to paystack to verify transaction
    const verify_response = await API_REQUESTS.Paystack.verify_transfer(
      reference
    );

    if (verify_response) {
      let data = {
        reference,
        transfer_record,
      };

      TransferEvent.emit("update-status", { data });

      next();
    } else {
      DefaultHelper.return_error(res, 404, "Unable to verify transaction");
    }
  },
  create_transfer_recipient_with_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { account_number, bank_code, account_name } = req?.body;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.create_transfer_recipient(
        account_number,
        bank_code,
        account_name
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //if request successful, attach recipient code to body
      const { recipient_code } = ps_response;

      //append to body request
      req.body.recipient_code = recipient_code;
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
  confirm_paystack_balance_can_cover_amount: async (req, res, next) => {
    try {
      const { target_package } = req?.body;
      //extract available amount from package
      const { available_amount } = target_package;

      //fetch paystack balance
      const ps_response = await API_REQUESTS.Paystack.fetch_paystack_balance();

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      let { currency, balance } = ps_response;
      //convert from kobo to naira
      balance = Number(balance / 100);

      //ensure currency for balance is naira
      if (String(currency)?.toUpperCase() != "NGN") {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //check if balance can cover amount
      const fee_charged =
        DefaultHelper.calculate_transfer_fee_charge_from_amount(
          available_amount
        );
      const can_cover = DefaultHelper.check_balance_can_cover_amount(
        balance,
        available_amount,
        fee_charged
      );

      if (!can_cover) {
        DefaultHelper.return_error(
          res,
          400,
          "Low paystack balance. Unable to process request"
        );
        return;
      }

      //append balance and fee to req body
      req.body.paystack_balance = balance;
      req.body.fee_charged = fee_charged;

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
  validate_transfer_code_params: async (req, res, next) => {
    //grab the transfer code
    const { transfer_code } = req?.params;

    //fetch transfer record
    const transfer_record = await TransferModel.fetch_transfer_by_transfer_code(
      transfer_code
    );

    if (!transfer_record) {
      DefaultHelper.return_error(res, 404, "Transfer record not found");
      return;
    }

    //append to body request
    req.body.transfer_code = transfer_code;
    req.body.transfer_record = transfer_record;

    next();
  },
  validate_transaction_reference_params: async (req, res, next) => {
    //grab the transaction ref
    const { transaction_ref } = req?.params;

    //fetch transfer record
    const transfer_record =
      await TransferModel.fetch_transfer_by_transaction_ref(transaction_ref);

    if (!transfer_record) {
      DefaultHelper.return_error(res, 404, "Transfer record not found");
      return;
    }

    //append to body request
    req.body.reference = transaction_ref;
    req.body.transfer_record = transfer_record;

    next();
  },
  fetch_transfer_record_by_package_id: async (req, res, next) => {
    //grab the package id
    const { package_id } = req?.body;

    //fetch transfer record
    const transfer_record = await TransferModel.fetch_transfer_by_package_id(
      package_id
    );

    if (!transfer_record) {
      DefaultHelper.return_error(res, 404, "Transfer record not found");
      return;
    }

    //append to body request
    req.body.reference = transfer_record?.transaction_ref;
    req.body.transfer_record = transfer_record;

    next();
  },
  create_transfer_record_on_db: async (req, res, next) => {
    try {
      const {
        admin_id,
        package_id,
        target_package,
        fee_charged,
        recipient_code,
        reason,
        account_name,
        account_number,
        bank_code,
      } = req?.body;
      const { available_amount } = target_package;

      //create form
      let form = {
        admin_id,
        package_id,
        transaction_ref: IdGenerator.transaction_ref(),
        amount: available_amount,
        recipient_code,
        fee_charged,
        reason,
        extra: {
          account_number,
          account_name,
          bank_code,
        },
      };

      //check if transfer record exists for package id
      let transfer_record = await TransferModel.fetch_transfer_by_package_id(
        package_id
      );

      if (!transfer_record) {
        //create new transfer record
        const created = await TransferModel.create_new_transfer_record(form);

        if (!created) {
          DefaultHelper.return_error(
            res,
            400,
            "Internal server error. Please try again later"
          );
          return;
        }

        //fetch new transfer record
        transfer_record = await TransferModel.fetch_transfer_by_id(created);
      }

      if (!transfer_record) {
        DefaultHelper.return_error(
          res,
          400,
          "Internal server error. Please try again later"
        );
        return;
      }

      //append transfer record to request body
      req.body.transfer_record = transfer_record;

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
  initiate_transfer_with_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { transfer_record } = req?.body;
      const { amount, transaction_ref, recipient_code, reason } =
        transfer_record;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.initiate_transfer(
        amount,
        transaction_ref,
        recipient_code,
        reason
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //if request successful, update transfer record on db
      const { status, transfer_code } = ps_response;

      const update_status = await TransferModel.update_transfer_record_status(
        status,
        transaction_ref
      );
      const update_transfer_code =
        await TransferModel.update_transfer_record_transfer_code(
          transfer_code,
          transaction_ref
        );

      //fetch updated transfer record
      const new_transfer_record =
        await TransferModel.fetch_transfer_by_transaction_ref(transaction_ref);
      if (!new_transfer_record) {
        DefaultHelper.return_error(
          res,
          400,
          "Internal server error. Please try again later"
        );
        return;
      }

      //rewrite request body transfer record
      req.body.transfer_record = new_transfer_record;
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
  finalize_transfer_with_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { transfer_code, otp, transfer_record } = req?.body;
      const { transaction_ref } = transfer_record;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.finalize_transfer(
        transfer_code,
        otp
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //if request successful, update transfer record status on db
      const { status } = ps_response;

      const update_status = await TransferModel.update_transfer_record_status(
        status,
        transaction_ref
      );

      //fetch updated transfer record
      const new_transfer_record =
        await TransferModel.fetch_transfer_by_transaction_ref(transaction_ref);
      if (!new_transfer_record) {
        DefaultHelper.return_error(
          res,
          400,
          "Internal server error. Please try again later"
        );
        return;
      }

      //rewrite request body transfer record
      req.body.transfer_record = new_transfer_record;
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
  resend_otp_from_paystack: async (req, res, next) => {
    try {
      //extract needed params
      const { transfer_code } = req?.body;

      //send request to paystack
      const ps_response = await API_REQUESTS.Paystack.resend_transfer_otp(
        transfer_code
      );

      if (!ps_response) {
        DefaultHelper.return_error(
          res,
          400,
          "Connection error. Please try again later"
        );
        return;
      }

      //if request successful, proceed
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
  fetch_multiple_transfers: async (req, res, next) => {
    try {
      const { q, page, sort } = req?.body;

      //fetch transfers by q and page
      const transfers = await TransferModel.fetch_multiple_transfers(
        q,
        page,
        sort
      );

      //meta data
      const tup = await TransferModel.count_all_multiple_transfers(q, sort);
      const meta = {
        q,
        page,
        total_results: parseInt(tup),
        has_next_page: DefaultHelper.check_has_prev_next_page(page, tup, true),
        has_prev_page: DefaultHelper.check_has_prev_next_page(page, tup, false),
      };

      //append to body request
      req.body.transfers = transfers;
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
};
