import crypto from "crypto";
import { getLandlordByEmail } from "../models/landlord.js";
import { storeEmailVerificationToken } from "../models/emailVerificationToken.js";
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

    //store verification token
    await storeEmailVerificationToken(verificationToken, expiresAt);

    //send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: `"Francel Boarding House" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<h2>Welcome to Francel BHMS!</h2>
             <p>Click the link below to verify your email. Expires in 3 minutes.</p>
             <a href="${verificationLink}">Verify Email</a>
      `,
    });

    res.status(200).json({ message: `Verification email sent to ${email}.` });
  } catch (error) {
    console.error("Error when signing up:", error);
  }
};

export { signup };
