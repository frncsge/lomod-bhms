import jwt from "jsonwebtoken";

const authenticateAccessToken = (requiredRole) => (req, res, next) => {
  const { access_token } = req.cookies;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(access_token, accessTokenSecret);

    //create user and role req object keys
    req.user = decoded.sub;
    req.role = decoded.role;

    //skips this if statement when there is no required role given
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { authenticateAccessToken };
