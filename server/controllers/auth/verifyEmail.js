import redisClient from "../../config/redis.js";
import { storeNewLandlord } from "../../models/landlord.js";
import { generateAccessToken } from "../../helpers/generateAccessToken.js";
import { generateRefreshToken } from "../../helpers/generateRefreshToken.js";
import { cacheRefreshToken } from "../../utils/cacheRefreshToken.js";
import { setAccessTokenCookie } from "../../utils/authCookies.js";

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    //retrieve email and password from cache
    const data = await redisClient.get(token);

    //check if cache still exists
    if (!data)
      return res.status(400).json({ message: "Invalid or expired link" });

    //parse data back to object
    const { email, hashedPassword, accountName } = JSON.parse(data);

    //email verified, create account
    const result = await storeNewLandlord(email, hashedPassword, accountName);
    const { landlord_id } = result;

    //delete verification token from redis after successful verification
    await redisClient.del(token);

    //create access and refresh tokens
    const user = { sub: landlord_id, role: "landlord" };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await cacheRefreshToken(refreshToken, user); 

    //store access token in httpOnly cookie
    setAccessTokenCookie(res, accessToken);

    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error when verifying the landlord email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { verifyEmail };
