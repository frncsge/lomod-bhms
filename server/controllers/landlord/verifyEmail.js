import redisClient from "../config/redis.js";
import { storeNewLandlord } from "../models/landlord.js";

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    //retrieve email and password from cache
    const data = await redisClient.get(token);

    //check if cache still exists
    if (!data) {
      return res.status(400).json({ message: "Invalid or expired link" });
    } else {
      //parse data back to object
      const { email, hashedPassword, accountName } = JSON.parse(data);

      //email verified, create account
      await storeNewLandlord(email, hashedPassword, accountName);

      //delete token from redis
      await redisClient.del(token);
    }

    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error when verifying the email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { verifyEmail };
