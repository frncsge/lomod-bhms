import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const { access_token } = req.cookies;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(access_token, accessTokenSecret);

    //create user object key
    const { sub, role } = decoded;
    req.user = { sub, role };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Signing in is required" });
  }
};
