import redisClient from "../config/redis";

export const cacheRefreshToken = async (token, user) => {
  const ttl = 7 * 24 * 60 * 60; //7 days time-to-live

  try {
    await redisClient.setEx(`refreshToken:${token}`, ttl, JSON.stringify(user));
  } catch (error) {
    console.error("Error caching refresh token:", error);
    throw error;
  }
};
