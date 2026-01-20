import crypto from "crypto";
import { getLandlordByEmail } from "../models/landlord.js";
import transporter from "../config/mailer.js";

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    //chcek if email already exists
    const emailTaken = await getLandlordByEmail(email);
    if (emailTaken)
      return res.status(409).json({ message: "Email already in use" });

    //email exists -> generate verification code and its expiry
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    //send verification email with the code
    await transporter.sendMail({
      from: `"Francel Boarding House" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      text: "Hello world?", // Plain-text version of the message
      html: "<b>Hello world?</b>", // HTML version of the message
    });

    res.status(200).json({ message: "Verification email sent" });
    //if verified, create and store new account
  } catch (error) {
    console.error("Error when signing up:", error);
  }
};

export { signup };
