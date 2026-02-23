import redisClient from "../config/redis.config.js";

//refresh token
export const refreshTokenCache = async ({ action = "set", token, user }) => {
  const ttl = 7 * 24 * 60 * 60; //7 days time-to-live
  const key = `refreshToken:${token}`;

  try {
    if (action === "set")
      await redisClient.setEx(key, ttl, JSON.stringify(user));

    if (action === "get") {
      const cachedRefreshToken = await redisClient.get(key);
      return cachedRefreshToken;
    }

    if (action === "del") await redisClient.del(key);
  } catch (error) {
    console.error("Error in refresh token cache:", error);
    throw error;
  }
};

//email verification token
export const verificationTokenCache = async ({
  action = "set",
  token,
  user,
}) => {
  const ttl = 180; //3 mins verification token expiry
  const key = `verificationToken:${token}`;

  try {
    if (action === "set")
      await redisClient.setEx(key, ttl, JSON.stringify(user));

    if (action === "get") {
      const cachedVerificationToken = await redisClient.get(key);
      return cachedVerificationToken;
    }

    if (action === "del") await redisClient.del(key);
  } catch (error) {
    console.error("Error in verification token caching:", error);
    throw error;
  }
};

//set password token
export const setPasswordToken = async ({ action = "set", token, user }) => {
  const ttl = 24 * 60 * 60; //1 day
  const key = `setPasswordToken:${token}`;

  try {
    if (action === "set") {
      await redisClient.setEx(key, ttl, JSON.stringify(user));
    }

    if (action === "get") {
      const cachedSetPasswordToken = await redisClient.get(key);
      return cachedSetPasswordToken;
    }

    if (action === "del") {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error("Error in set password token:", error);
    throw error;
  }
};

//tenant acc creation cooldown
export const tenantAccCreationCd = async ({ action = "set", id }) => {
  const key = `createTenantCd:${id}`;
  const ttl = 30; //30 seconds

  try {
    if (action === "set") {
      await redisClient.setEx(key, ttl, "Tenant account creation cooldown");
    }

    if (action === "get") {
      const cooldown = await redisClient.ttl(key);
      return cooldown;
    }
  } catch (error) {
    console.error("Error in tenant account creation cooldown:", error);
    throw error;
  }
};
