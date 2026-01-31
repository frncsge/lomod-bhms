import redisClient from "../../config/redis.js";
import { clearJwtCookies } from "../../utils/authCookies.util.js";

export const signout = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    //delete refresh token from redis
    if (refresh_token) {
      await redisClient.del(`refreshToken:${refresh_token}`);
    }

    //then clear the access and refresh token cookies
    clearJwtCookies(res);
    res.status(200).json({ message: "Sign-out successful" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ message: "Server error" });
  }
};
