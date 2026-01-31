import redisClient from "../../config/redis.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/jwt.helper.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../../utils/authCookies.util.js";
import { cacheRefreshToken } from "../../utils/authCache.util.js";

export const getNewAccessToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    //check if no refresh token
    if (!refresh_token)
      return res.status(401).json({ message: "No refresh token provided" });

    //validate refresh token
    const data = await redisClient.get(`refreshToken:${refresh_token}`);
    if (!data)
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });

    //remove used/old refresh token from redis cache
    await redisClient.del(`refreshToken:${refresh_token}`);

    //generate new access and refresh token
    const { sub, role } = JSON.parse(data);
    const user = { sub, role };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await cacheRefreshToken(newRefreshToken, user);

    //store new access and refresh token in httpOnly cookie
    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ message: "Tokens refreshed" });
  } catch (error) {
    console.error("Error getting new access token:", error);
    res.status(500).json({ message: "Server error" });
  }
};
