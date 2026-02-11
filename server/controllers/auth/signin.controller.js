import bcrypt from "bcrypt";
import { getLandlordByEmail } from "../../models/landlord.model.js";
import { createUserSession } from "../../utils/session.util.js";

export const landlordSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if email exists
    const landlord = await getLandlordByEmail(email);
    if (!landlord)
      return res.status(401).json({ message: "Invalid email or password" });

    //check if password match
    const passwordMatch = await bcrypt.compare(password, password_hash);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    //create user session after successful sign in 
    const { landlord_id, password_hash } = landlord;
    const user = { sub: landlord_id, role: "landlord" };
    await createUserSession(res, user)

    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error occured while signing in landlord:", error);
    res.status(500).json({ message: "Server error" });
  }
};
