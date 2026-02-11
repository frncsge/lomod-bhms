import {
  getCachedVerificationToken,
  delCachedVerificationToken,
} from "../../utils/cache.util.js";
import { createUserSession } from "../../utils/session.util.js";

export const verifyEmail = async (req, res) => {
  const { token: verificationToken } = req.query;

  try {
    //validate verification token
    const cachedVerificationToken =
      await getCachedVerificationToken(verificationToken);
    if (!cachedVerificationToken)
      return res.status(400).json({ message: "Invalid or expired link" });

    //if verification token is valid, store new landlord account to the database
    const { email, hashedPassword, accountName } = JSON.parse(
      cachedVerificationToken,
    );
    const result = await storeNewLandlord(email, hashedPassword, accountName);

    //then, create user session
    const { landlord_id } = result;
    const user = { sub: landlord_id, role: "landlord" };
    await createUserSession(res, user);

    //finally, delete the used verification token
    await delCachedVerificationToken(verificationToken);

    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error when verifying the landlord email:", error);
    res.status(500).json({ message: "Server error" });
  }
};
