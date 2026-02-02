import bcrypt from "bcrypt";
import { generateRandomPassword } from "../../helpers/password.helper.js";


export const createTenantAccount = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const saltRound = 10;

  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "Complete name of the tenant is needed" });

  try {
    //generate hashed password for tenant
    const password = generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(password, saltRound);

    //store new tenant to the database
  } catch (error) {
    console.error("Error generating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }

  //store tenant in database
};
