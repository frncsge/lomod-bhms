import bcrypt from "bcrypt";
import { getLandlordByEmail } from "../../../models/landlord.js";

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if email exists
    const emailExists = await getLandlordByEmail(email);

    if (!emailExists)
      return res.status(401).json({ message: "Invalid email or password" });

    //check if password match
    const { password_hash } = emailExists;
    const passwordMatch = await bcrypt.compare(password, password_hash);

    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error occured while signing in landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { signin };

//put JWT for sign-up and sign-in
