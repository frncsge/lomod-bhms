import bcrypt from "bcrypt";
import { getLandlordByEmail } from "../../models/landlord.js";
import { generateAccessToken } from "../../helpers/generateAccessToken.js";
import { generateRefreshToken } from "../../helpers/generateRefreshToken.js";
import { cacheRefreshToken } from "../../utils/cacheRefreshToken.js";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/authCookies.js";

const landlordSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if email exists
    const emailExists = await getLandlordByEmail(email);

    if (!emailExists)
      return res.status(401).json({ message: "Invalid email or password" });

    //destructure landlord_id and password_hash
    const { landlord_id, password_hash } = emailExists;

    //check if password match
    const passwordMatch = await bcrypt.compare(password, password_hash);

    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    //create access and refresh tokens
    const user = { sub: landlord_id, role: "landlord" };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await cacheRefreshToken(refreshToken, user);

    //store access and refresh tokens in httpOnly cookie
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error occured while signing in landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { landlordSignin };
