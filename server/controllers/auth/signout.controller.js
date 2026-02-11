import { clearJwtCookies } from "../../utils/cookies.util.js";
import { delCachedRefreshToken } from "../../utils/cache.util.js";

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
