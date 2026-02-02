import bcrypt from "bcrypt";
import { generateRandomPassword } from "../../helpers/password.helper.js";
import { storeNewTenant } from "../../models/tenant.model.js";

export const createTenantAccount = async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
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
    const newTenant = await storeNewTenant(
      firstName,
      lastName,
      phoneNumber,
      hashedPassword,
    );
    const { tenant_id, username } = newTenant;

    res
      .status(200)
      .json({ message: "Tenant account made" });
  } catch (error) {
    console.error("Error creating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }

  //email the landlord the new tenant account credential
};
