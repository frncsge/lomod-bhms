import { REDISEARCH_LANGUAGE } from "redis";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/jwt.helper";
import { cacheRefreshToken } from "./authCache.util";
import { sendJwtCookies } from "./authCookies.util";

export const createUserSession = async (res, user) => {
  //generate and cache jwt for user session
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await cacheRefreshToken(refreshToken, user);

  //send jwt as cookies
  const tokens = { accessToken, refreshToken };
  sendJwtCookies(res, tokens);
};
