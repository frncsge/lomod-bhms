import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  return jwt.sign(user, accessTokenSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (user) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  return jwt.sign(user, refreshTokenSecret);
};

export const generateRandomToken = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};
