import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getLandlordByEmail } from "../../../models/landlord.js";

const signin = async (req, res) => {
  const { email, password } = req.body;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

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

    //create access token
    const accessToken = jwt.sign({ sub: landlord_id }, accessTokenSecret, {
      expiresIn: "15m",
    });

    //store access token in httpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, //true in prod, only for https
      sameSite: "none", //allow cross-origin req
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Sign-in successful"});
  } catch (error) {
    console.error("Error occured while signing in landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { signin };

//put JWT for sign-up and sign-in
