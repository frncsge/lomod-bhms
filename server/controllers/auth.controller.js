//to do: refactor auth based on new database schema
//shcema also isnt done

import bcrypt, { hash } from "bcrypt";
import {
  getUserByIdentifier,
  getUserByEmail,
  getUserById,
  storeNewUser,
} from "../models/users.model.js";
import { sendEmailVerificationLink } from "../helpers/mailer.helper.js";
import { clearJwtCookies } from "../utils/cookies.util.js";
import { createUserSession } from "../utils/session.util.js";
import {
  delCachedRefreshToken,
  getCachedVerificationToken,
  delCachedVerificationToken,
  getCachedRefreshToken,
} from "../utils/cache.util.js";
import { generateTenantUsername } from "../helpers/tenant.helper.js";
import { sendSetPasswordLink } from "../helpers/mailer.helper.js";
import { capitalizeWords } from "../helpers/string.helper.js";

export const landlordSignUp = async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 12;

  try {
    //chcek if email is already registered
    const emailTaken = await getUserByEmail(email);
    if (emailTaken)
      return res.status(409).json({ message: "Email already in use" });

    //hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // send verification email
    const newLandlord = { email, hashedPassword, role: "landlord" };
    const temporaryRemoveThis = await sendEmailVerificationLink(newLandlord);

    res
      .status(200)
      .json({ message: `Verification email sent ${temporaryRemoveThis}` });
  } catch (error) {
    console.error("Error when signing up landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    //check if identifier is valid (email or username)
    const user = await getUserByIdentifier(identifier);
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });

    //check if passwords match
    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match)
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });

    await createUserSession(res, { sub: user.user_id, role: user.user_role });

    res.status(200).json({ message: "Sign in successful" });
  } catch (error) {
    console.error("Error occured while signing in:", error);
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
    const { email, hashedPassword, role } = JSON.parse(cachedVerificationToken);
    const newUserId = await storeNewUser({
      identifier: email,
      hashedPassword,
      role,
    });

    //then, create user session
    const user = { sub: newUserId, role };
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

export const createTenantAccount = async (req, res) => {
  const firstName = capitalizeWords(req.body.firstName);
  const lastName = capitalizeWords(req.body.lastName);
  const { phoneNumber } = req.body;

  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "First and last names of tenant is required" });

  try {
    const username = generateTenantUsername({ firstName, lastName });
    const newTenant = {
      identifier: username,
      firstName,
      lastName,
      phoneNumber,
      role: "tenant",
    };

    //store new tenant as pending, and get the email of the landlord
    const [newUserId, user] = await Promise.all([
      storeNewUser(newTenant),
      getUserById(req.user.sub),
    ]);

    const { email } = user;

    const removeThis = await sendSetPasswordLink(email, newUserId);

    res.status(200).json({ message: `Set password link sent ${removeThis}` });
  } catch (error) {
    console.error("Error creating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }
};
