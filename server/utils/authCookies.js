export const setAccessTokenCookie = (res, accessToken) => {
  //store access token in httpOnly cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", //allow cross-origin req
    maxAge: 15 * 60 * 1000,
  });
};
