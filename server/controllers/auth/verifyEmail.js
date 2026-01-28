import redisClient from "../../config/redis.js";
import jwt from "jsonwebtoken";
import { storeNewLandlord } from "../../models/landlord.js";

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

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

    //delete token from redis
    await redisClient.del(token);

    //create access token
    const accessToken = jwt.sign(
      { sub: landlord_id, role: "landlord" },
      accessTokenSecret,
      {
        expiresIn: "15m",
      },
    );

    //store access token in httpOnly cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false, //true in prod, only for https
      sameSite: "none", //allow cross-origin req
      maxAge: 15 * 60 * 1000,
    });

    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error when verifying the landlord email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { verifyEmail };
