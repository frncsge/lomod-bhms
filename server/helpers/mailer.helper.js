import transporter from "../config/mailer.config.js";
import { cacheVerificationToken, cacheSetPasswordToken } from "../utils/cache.util.js";
import { generateRandomToken } from "./tokens.helper.js";

export const sendEmailVerificationLink = async (user) => {
  const verificationToken = generateRandomToken();
  const verificationLink = `dummylink?token=${verificationToken}`;

  try {
    // await transporter.sendMail({
    //   from: `"Francel Boarding House" <${process.env.SMTP_USER}>`,
    //   to: user.email,
    //   subject: "Francel BHMS Landlord Email Verification",
    //   html: `<h2>Welcome to Francel BHMS!</h2>
    //          <p>Click the link below to verify your email. Expires in 3 minutes.</p>
    //          <a href="${verificationLink}">Verify Email</a>
    //   `,
    // });

    await cacheVerificationToken(verificationToken, user);
    return verificationToken; //for testing purposes
  } catch (error) {
    console.error("Error sending email verification link", error);
    throw error;
  }
};

export const sendSetPasswordLink = async (email, user) => {
  const setPasswordToken = generateRandomToken();
  const setPasswordLink = `dummylink?token=${setPasswordToken}`;

  try {
    // await transporter.sendMail({
    //   from: `"Francel Boarding House" <${process.env.SMTP_USER}>`,
    //   to: email,
    //   subject: "New Tenant Account: Set Password",
    //   html: `
    //   <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    //     <h2 style="color: #2E86C1;">New Tenant Account Created</h2>
    //     <p>A new tenant account has been created for <strong>${user.firstName} ${user.lastName}</strong>.</p>

    //     <p><strong>Tenant Username:</strong> ${user.username}</p>

    //     <p>Forward this link to the tenant so they can securely set their password:</p>
    //     <p><a href="${setPasswordLink}" target="_blank" style="padding: 10px 15px; background-color: #2E86C1; color: #fff; text-decoration: none; border-radius: 5px;">Set Password</a></p>
    //     <p>This link is valid for 24 hours.</p>
    //   </div>
    // `,
    // });

    await cacheSetPasswordToken(setPasswordToken, user);
    return setPasswordToken; //for testing purposes
  } catch (error) {
    console.error("Error sending set password link", error);
    throw error;
  }
};
