import bcrypt from "bcrypt";
import { getLandlordByEmail } from "../models/landlord.model.js";
import { sendEmailVerificationLink } from "../helpers/mailer.helper.js";
import { clearJwtCookies } from "../utils/cookies.util.js";
import { createUserSession } from "../utils/session.util.js";
import {
  delCachedRefreshToken,
  getCachedVerificationToken,
  delCachedVerificationToken,
} from "../utils/cache.util.js";

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

    // send verification email
    const landlord = { email, hashedPassword, accountName };
    const temporaryRemoveThis = await sendEmailVerificationLink(
      email,
      landlord,
    );

    res
      .status(200)
      .json({ message: `Verification email sent ${temporaryRemoveThis}` });
  } catch (error) {
    console.error("Error when signing up landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const landlordSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if email exists
    const landlord = await getLandlordByEmail(email);
    if (!landlord)
      return res.status(401).json({ message: "Invalid email or password" });

    //check if password match
    const passwordMatch = await bcrypt.compare(password, password_hash);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    //create user session after successful sign in
    const { landlord_id, password_hash } = landlord;
    const user = { sub: landlord_id, role: "landlord" };
    await createUserSession(res, user);

    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error occured while signing in landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    //delete refresh token from redis
    if (refresh_token) {
      await delCachedRefreshToken(refresh_token);
    }

    clearJwtCookies(res);
    res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

export const refreshUserSession = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    //check if no refresh token
    if (!refresh_token)
      return res.status(401).json({ message: "Signing in is required" });

    //check if refresh token given is expired
    const cachedRefreshToken = await getCachedRefreshToken(refresh_token);
    if (!cachedRefreshToken) {
      //force signout
      clearJwtCookies(res);
      return res
        .status(401)
        .json({ message: "Session expired. Please sign in again" });
    }

    //remove used/old refresh token from redis cache to avoid reuse
    await delCachedRefreshToken(refresh_token);

    //create new user session
    const { sub, role } = JSON.parse(cachedRefreshToken);
    const user = { sub, role };
    await createUserSession(res, user);

    res.status(200).json({ message: "Tokens refreshed" });
  } catch (error) {
    console.error("Error getting new access token:", error);
    res.status(500).json({ message: "Server error" });
  }
};
