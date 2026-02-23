import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokens.helper.js";
import { refreshTokenCache } from "./cache.util.js";
import { sendJwtCookies } from "./cookies.util.js";

export const createUserSession = async (res, user) => {
  try {
    //generate and cache jwt for user session
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await refreshTokenCache({ token: refreshToken, user });

    //send jwt as cookies
    const tokens = { accessToken, refreshToken };
    sendJwtCookies(res, tokens);
  } catch (error) {
    console.error("Error creating user session", error);
    throw error;
  }
};
