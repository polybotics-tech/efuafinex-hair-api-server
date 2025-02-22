import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { config } from "../../config.js";
import { DefaultHelper } from "../utils/helpers.js";
import { logbot } from "../../logger.js";

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // meta data that appears in header & footer of e-mails
    name: config?.email?.title,
    link: "https://polybotics.tech/",
    // custom copyright message
    copyright: `Copyright © ${new Date().getFullYear()} EFUAFINEX. All rights reserved.`,
    // optional brand logo
    logo: "https://test.polybotics.tech/uploads/icon.png",
    logoHeight: "64px",
  },
});

const greeting = "Hello";
const signature = "Best Regards";
const outro = `If you ever need assistance, our support team is here to help. Feel free to reach out at ${config?.email?.support}`;
const brandTitle = config?.email?.title;

//create transporter
const transporter = nodemailer.createTransport({
  host: config?.email?.server,
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: config?.email?.account,
    pass: config?.email?.password,
  },
  from: config?.email?.account,
});

//configure mail options
const MailOptions = async (recipients = [], subject, body) => ({
  from: `${brandTitle} <${config?.email?.account}>`,
  to: DefaultHelper.format_recipient_emails(recipients),
  subject: `${subject} | ${brandTitle}`,
  html: await mailGenerator.generate(body),
  text: await mailGenerator.generatePlaintext(body),
});

/////
export const MailGenerator = {
  registration_success: (fullname) => ({
    body: {
      name: fullname,
      greeting,
      signature,
      intro: [
        `Welcome to ${brandTitle}. We're excited to have you on board. Your account has been successfully created, and you're now part of our community`,
        `We're thrilled to have you with us and can't wait for you to experience everything ${brandTitle} has to offer`,
      ],
      outro,
    },
  }),
  otp_generated: (fullname, otp) => ({
    body: {
      name: fullname,
      greeting,
      signature,
      intro: [
        "To complete your email verification process, please use the One-Time Password (OTP) below:",
        `\n\n ${otp} \n\n`,
        "This code is valid for the next 15 minutes. Please do not share this code with anyone for security reasons.",
        "If you did not request this verification, please ignore this email, or delete it as soon as you see it.",
      ],
      outro,
    },
  }),
  otp_verified: (fullname) => ({
    body: {
      name: fullname,
      greeting,
      signature,
      intro: [
        "Congratulations!!! Your email has been successfully verified.",
        `You can now enjoy full access to ${brandTitle} and all its amazing features.`,
        "Thank you for joining us. We are truly happy to welcome aboard!!!",
      ],
      outro,
    },
  }),
  password_changed: (fullname) => ({
    body: {
      name: fullname,
      greeting,
      signature,
      intro: [
        `This is a confirmation that your password has been successfully changed for your ${brandTitle} account.`,
        "If you made this change, no further action is required. However, if you did not request this change, please reset your password immediately and contact our support team",
        "Your security is our top priority. Please ensure your account remains protected by using a strong password, and never share your password with anyone",
      ],
      outro,
    },
  }),
  package_funded: (
    fullname,
    amount,
    package_id,
    transaction_ref,
    package_title
  ) => ({
    body: {
      name: fullname,
      greeting,
      signature,
      intro: [
        `We're pleased to inform you that your deposit of ₦${amount} for the [->${package_title}<-] package has been successfully processed`,
        "Your funds have been securely added to your package, and you're on your way to enjoying the benefits of your package",
        "Along with this confirmation email, we have sent a summary of the processed transaction.",
      ],
      table: {
        data: [
          {
            name: "Package Title",
            value: `${package_title}`,
          },
          {
            name: "Transaction Ref",
            value: `${transaction_ref}`,
          },
          {
            name: "Package ID",
            value: `${package_id}`,
          },
          {
            name: "Amount",
            value: `₦ ${amount}`,
          },
        ],
        columns: {
          // Optionally, change column text alignment
          customAlignment: {
            value: "right",
          },
        },
      },
      outro,
    },
  }),
  bulk_mail_to_users: (body) => ({
    body: {
      name: "Beloved",
      greeting,
      signature,
      intro: [`${body}`],
      outro,
    },
  }),
};
/////

export const MailSender = {
  registration_success: async (user) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      `New Registration Successful`,
      MailGenerator.registration_success(fullname)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
  otp_generated: async (user, otp) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      "One-Time-Password (OTP) Verification",
      MailGenerator.otp_generated(fullname, otp)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
  otp_verified: async (user) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      "Email Verification Successful",
      MailGenerator.otp_verified(fullname)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
  password_changed: async (user) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      "Account Password Updated",
      MailGenerator.password_changed(fullname)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
  package_funded: async (
    user,
    amount,
    package_id,
    transaction_ref,
    package_title
  ) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      "Deposit Successful - Funds Added To Package",
      MailGenerator.package_funded(
        fullname,
        amount,
        package_id,
        transaction_ref,
        package_title
      )
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
  bulk_mail_to_users: async (recipients, subject, body) => {
    const options = await MailOptions(
      recipients,
      `${subject}`,
      MailGenerator.bulk_mail_to_users(body)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        transporter.sendMail(options);
        logbot.Error(`Error sending mail - ${error}`);
      }
    });
  },
};
