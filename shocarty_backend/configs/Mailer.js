import nodemailer from "nodemailer";
import { ENV } from "./Env.js";

const { MAIL_FROM_NAME, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = ENV;

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT, 10),
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  family: 4,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// transporter.verify((error) => {
//   if (error) console.log("...........:", error);
// });
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP CONNECTION SUCCESS:", success);
  }
});
