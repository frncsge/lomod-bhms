import { validateEmailVerificationToken } from "../models/emailVerificationToken.js";

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    //check token in the database if it is still valid (not expired and still not in use)
    const isValid = await validateEmailVerificationToken(token);

    if (!isValid)
      return res.status(400).json({ message: "Invalid verification link" });

    //store account if valid
  } catch (error) {
    console.error("Error when verifying the email:", error);
  }
};
