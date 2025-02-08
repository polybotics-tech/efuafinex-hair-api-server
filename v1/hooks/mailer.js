import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { config } from "../../config.js";
import { DefaultHelper } from "../utils/helpers.js";

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // meta data that appears in header & footer of e-mails
    name: "EFUAFINIX HAIR",
    link: "https://polybotics.tech/",
    // custom copyright message
    copyright: `Copyright © ${new Date().getFullYear()} EFUAFINIX. All rights reserved.`,
    // optional brand logo
    // logo: 'https://mailgen.js/img/logo.png'
    // logoHeight: '30px'
  },
});

const greeting = "Hello";
const signature = "Yours sincerely";
const outro = `For any assistance, feel free to contact our support team at ${config?.email?.support}`;
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
        "Congratulations! 🎉 Your email has been successfully verified.",
        `You can now enjoy full access to ${brandTitle} and all its amazing features.`,
        "Thank you for joining us. We are truly happy to welcome aboard! 🚀",
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
};
/////

export const MailSender = {
  otp_generated: async (user, otp) => {
    const { fullname, email } = user;

    const options = await MailOptions(
      [`${email}`],
      "One-Time-Password (OTP) Verification",
      MailGenerator.otp_generated(fullname, otp)
    );

    await transporter.sendMail(options, function (error, info) {
      if (error) {
        console.log("err: ", error);
      } else {
        console.log("mail sent: ", info);
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
        console.log("err: ", error);
      } else {
        console.log("mail sent: ", info);
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
        console.log("err: ", error);
      } else {
        console.log("mail sent: ", info);
      }
    });
  },
};
