import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const { access_token } = req.cookies;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(access_token, accessTokenSecret);

    //create user object key
    const { sub, role } = decoded;
    req.user = { id: sub, role };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" });
  }
};
