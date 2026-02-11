import bcrypt from "bcrypt";
import { getLandlordByEmail } from "../../models/landlord.model.js";
import { sendEmailVerificationLink } from "../../helpers/mailer.helper.js";
import { generateRandomToken } from "../../helpers/tokens.helper.js";
import { cacheVerificationToken } from "../../utils/cache.util.js";

export const landlordSignUp = async (req, res) => {
  const { email, password, accountName } = req.body;
  const saltRounds = 12;

  try {
    //chcek if email is already registered
    const emailTaken = await getLandlordByEmail(email);
    if (emailTaken)
      return res.status(409).json({ message: "Email already in use" });

    //hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const landlord = { email, hashedPassword, accountName };
    const verificationToken = generateRandomToken();
    await cacheVerificationToken(verificationToken, landlord);

    // send verification email
    // await sendEmailVerificationLink(verificationLink, email);

    res
      .status(200)
      .json({ message: `Verification email sent ${verificationToken}.` });
  } catch (error) {
    console.error("Error when signing up landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};
