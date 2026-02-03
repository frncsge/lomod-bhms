import crypto from "crypto";
import redisClient from "../../config/redis.js";
import { sendSetPasswordLink } from "../../helpers/mailer.helper.js";
import { getLandlordById } from "../../models/landlord.model.js";

export const createTenantAccount = async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "Complete name of the tenant is needed" });

  try {
    //generate username for tenant
    const randomSuffix = crypto.randomBytes(2).toString("hex");
    const username = `${lastName.trim().replace(/\s+/g, "")}.${firstName.replace(/\s+/g, "_")}${randomSuffix}`;

    //generate set password link token
    const setPasswordToken = crypto.randomBytes(32).toString("hex");

    //cache set password link token with the tenant's info
    const newTenantCredentials = { username, firstName, lastName, phoneNumber };
    await redisClient.setEx(
      `tenant-set-password:${setPasswordToken}`,
      24 * 60 * 60,
      JSON.stringify(newTenantCredentials),
    );

    //get landlord email so we can send the set password link to it
    const landlord_id = req.user.id;
    const data = await getLandlordById(landlord_id);
    const { email: landlordEmail } = data;

    //send set password link through email
    const setPasswordLink = `http://localhost:3000/auth/tenant/set-password?token=${setPasswordToken}`;
    const tenantName = `${firstName} ${lastName}`;
    await sendSetPasswordLink(
      username,
      setPasswordLink,
      landlordEmail,
      tenantName,
    );

    res
      .status(200)
      .json({ message: `Set password link sent ${setPasswordLink}` });
  } catch (error) {
    console.error("Error creating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }

  //email the landlord the new tenant account credential
};
