import { transporter } from "../../configs/Mailer.js";
import { ENV } from "../../configs/Env.js";

const { MAIL_FROM_NAME, MAIL_USER } = ENV;

export const mailSender = async (email, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: `${MAIL_FROM_NAME} <${MAIL_USER}>`,
      to: email,
      subject,
      html,
    };
    if (attachments.length) {
      mailOptions.attachments = attachments;
    }
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(`Error: ${error.message} failed to mail send`);
    throw error;
  }
};
