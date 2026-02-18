import redisClient from "../config/redis.config.js";

export const cacheRefreshToken = async (refreshToken, user) => {
  const ttl = 7 * 24 * 60 * 60; //7 days time-to-live
  const key = `refreshToken:${refreshToken}`;

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(user));
  } catch (error) {
    console.error("Error caching refresh token:", error);
    throw error;
  }
};

export const getCachedRefreshToken = async (refreshToken) => {
  const key = `refreshToken:${refreshToken}`;

  try {
    const cachedRefreshToken = await redisClient.get(key);
    return cachedRefreshToken;
  } catch (error) {
    console.error("Error getting cached refresh token:", error);
    throw error;
  }
};

export const delCachedRefreshToken = async (refreshToken) => {
  const key = `refreshToken:${refreshToken}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error getting cached refresh token:", error);
    throw error;
  }
};

export const cacheVerificationToken = async (token, user) => {
  const ttl = 180; //3 mins verification token expiry
  const key = `verificationToken:${token}`;

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(user));
  } catch (error) {
    console.error("Error caching verification token:", error);
    throw error;
  }
};

export const getCachedVerificationToken = async (token) => {
  const key = `verificationToken:${token}`;

  try {
    const cachedVerificationToken = await redisClient.get(key);
    return cachedVerificationToken;
  } catch (error) {
    console.error("Error getting cached verification token:", error);
    throw error;
  }
};

export const delCachedVerificationToken = async (token) => {
  const key = `verificationToken:${token}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error deleting cached verification token:", error);
    throw error;
  }
};

export const cacheSetPasswordToken = async (token, user) => {
  const ttl = 24 * 60 * 60; //1 day
  const key = `setPasswordToken:${token}`;

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(user));
  } catch (error) {
    console.error("Error caching set password token:", error);
    throw error;
  }
};

export const getCachedSetPasswordToken = async (token) => {
  const key = `setPasswordToken:${token}`;

  try {
    const cachedSetPasswordToken = await redisClient.get(key);
    return cachedSetPasswordToken;
  } catch (error) {
    console.error("Error getting cached set password token:", error);
    throw error;
  }
};

export const delCachedSetPasswordToken = async (token) => {
  const key = `setPasswordToken:${token}`;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error deleting cached set password token:", error);
    throw error;
  }
};
