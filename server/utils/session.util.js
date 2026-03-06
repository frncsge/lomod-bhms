import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokens.helper.js";
import { refreshTokenCache } from "./tokenCache.util.js";
import { refreshTokenCache } from "./tokenCache.util.js";
import { sendJwtCookies, clearJwtCookies } from "./cookies.util.js";

export const userSession = {
  create: async (res, user) => {
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
  },

  terminate: async (res, refreshToken = null) => {
    try {
      if (refreshToken !== null) {
        await refreshTokenCache({ action: "del", token: refreshToken });
      }
      clearJwtCookies(res);
    } catch (error) {
      console.error("Error terminating user session", error);
      throw error;
    }
  },
};
