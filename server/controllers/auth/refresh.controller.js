import { clearJwtCookies } from "../../utils/cookies.util.js";
import {
  getCachedRefreshToken,
  delCachedRefreshToken,
} from "../../utils/cache.util.js";
import { createUserSession } from "../../utils/session.util.js";

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
      return res.status(401).json({ message: "Session expired. Please sign in again" });
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
