import nodemailer from "nodemailer";
import { ENV } from "./Env.js";
import dns from "node:dns";
const { MAIL_FROM_NAME, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = ENV;

dns.lookup(MAIL_HOST, { family: 4 }, (err, address, family) => {
  console.log("DNS IPv4:", { err, address, family });
});

console.log("MAIL_HOST:", MAIL_HOST);
console.log("MAIL_PORT:", MAIL_PORT);
console.log("SMTP CONFIG:", {
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT),
  family: 4,
});

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT),
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

transporter.verify((error) => {
  if (error) console.log(`Error: ${error.message} smtp connection failed`);
});
