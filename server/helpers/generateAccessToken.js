import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  return jwt.sign(user, accessTokenSecret, { expiresIn: "15m" });
};
