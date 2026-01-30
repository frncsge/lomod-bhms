import crypto from "crypto";
import bcrypt from "bcrypt";
import redisClient from "../../config/redis.js";
import { getLandlordByEmail } from "../../models/landlord.js";
import { sendEmailVerificationLink } from "../../helpers/sendEmailVerificationLink.js";

const landlordSignup = async (req, res) => {
  const { email, password, accountName } = req.body;
  const salt_round = 10;

  try {
    //chcek if email already exists
    const emailTaken = await getLandlordByEmail(email);
    if (emailTaken)
      return res.status(409).json({ message: "Email already in use" });

    //hash password
    const hashedPassword = await bcrypt.hash(password, salt_round);

    //generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    //cache email and hashed password for easier retrieval later
    await redisClient.setEx(
      verificationToken,
      180, //3 mins expiry
      JSON.stringify({ email, hashedPassword, accountName }),
    );

    // send verification email
    // const verificationLink = `http://localhost:3000/auth/landlord/verify-email?token=${verificationToken}`;
    // await sendEmailVerificationLink(verificationLink, email);

    res
      .status(200)
      .json({ message: `Verification email sent ${verificationToken}.` });
  } catch (error) {
    console.error("Error when signing up landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { landlordSignup };
