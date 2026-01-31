export const setAccessTokenCookie = (res, accessToken) => {
  //store access token in httpOnly cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", //allow cross-origin req
    maxAge: 15 * 60 * 1000, //15m
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  //store refresh token in httpOnly cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });
};

export const clearJwtCookies = (res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};
