//future francis, this is past francis. you need to work on this file

import { getLandlordById } from "../models/landlord.model.js";
import { generateTenantUsername } from "../helpers/tenant.helper.js";
import { generateRandomToken } from "../helpers/tokens.helper.js";
import { cacheSetPasswordToken } from "../utils/cache.util.js";

export const createTenantAccount = async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "Complete name of the tenant is needed" });

  try {
    const newTenant = { username, firstName, lastName, phoneNumber };
    const username = generateTenantUsername(newTenant);
    const setPasswordToken = generateRandomToken();
    await cacheSetPasswordToken(setPasswordToken, newTenant);

    //get landlord email so we can send the set password link to it
    const landlord_id = req.user.id;
    const data = await getLandlordById(landlord_id);
    const { email: landlordEmail } = data;

    //send set password link through email
    // const setPasswordLink = `dummylink?token=${setPasswordToken}`;
    // const tenantName = `${firstName} ${lastName}`;
    // await sendSetPasswordLink(
    //   username,
    //   setPasswordLink,
    //   landlordEmail,
    //   tenantName,
    // );

    res.status(200).json({ message: `Set password link sent` });
  } catch (error) {
    console.error("Error creating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }
};
