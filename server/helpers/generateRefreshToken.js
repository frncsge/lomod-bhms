import jwt from "jsonwebtoken";

export const generateRefreshToken = (user) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  return jwt.sign(user, refreshTokenSecret);
};
